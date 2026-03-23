import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PasswordService } from 'src/common/security/password.service';
import { SessionsService } from 'src/sessions/sessions.service';
import { Session } from 'src/sessions/types/sessions.types';
import { UsersRepository } from 'src/users/users.repository';
import { JwtTokenService } from './jwt-token.service';
import { RedisService } from 'src/common/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordService: PasswordService,
    private readonly sessionsService: SessionsService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly redisService: RedisService,
  ) {}

  async login(
    email: string,
    password: string,
    user_agent?: string,
    ip_address?: string,
  ): Promise<{
    data: { accessToken: string; refreshToken: string };
    message: string;
  }> {
    const normalizedEmail = email.trim().toLowerCase();

    const user =
      await this.usersRepository.findAuthUserByEmail(normalizedEmail);
    let compare: { valid: boolean; needsRehash: boolean };

    if (!user || user.is_disabled || user.deleted_at) {
      compare = await this.passwordService.compare(password);
      throw new UnauthorizedException('Invalid credentials');
    } else {
      compare = await this.passwordService.compare(
        password,
        user.password_hash,
      );
    }

    if (!compare || !compare.valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (compare.needsRehash) {
      // handle later
      const hashedPass = await this.passwordService.hash(password);

      await this.usersRepository.saveRehashPassword(user.id, hashedPass);
    }

    const { sessionId, token_version } =
      await this.sessionsService.createSession(user.id, user_agent, ip_address);

    const refreshToken = await this.jwtTokenService.signRefreshToken(
      user.id,
      sessionId,
      token_version,
    );
    const accessToken = await this.jwtTokenService.signAccessToken(
      user.id,
      sessionId,
    );

    await this.redisService.set('test', 'hello');
    const value = await this.redisService.get('test');
    return {
      data: { accessToken, refreshToken },
      message: 'Login successful',
    };
  }

  async refreshAuthToken(
    sessionId: string,
    ver: number,
    user_id: string,
  ): Promise<{
    data: { accessToken: string; refreshToken: string };
    message: string;
  }> {
    const session: Session | null =
      await this.sessionsService.validateSession(sessionId);
    if (!session || session.token_version !== ver) {
      await this.sessionsService.revokeSession(sessionId);
      throw new UnauthorizedException('TOKEN_REUSE_DETECTED');
    }

    const newSession: Session | null =
      await this.sessionsService.rotatetoken_version(sessionId, ver);

    if (!newSession) {
      await this.sessionsService.revokeSession(sessionId);
      throw new UnauthorizedException();
    }

    const accessToken = await this.jwtTokenService.signAccessToken(
      user_id,
      sessionId,
    );
    const newrefreshToken = await this.jwtTokenService.signRefreshToken(
      user_id,
      sessionId,
      newSession.token_version,
    );

    return {
      data: { accessToken, refreshToken: newrefreshToken },
      message: 'Token refreshed successfully',
    };
  }

  async logout(sessionId: string): Promise<{ data: null; message: string }> {
    await this.sessionsService.revokeSession(sessionId);

    return {
      data: null,
      message: 'Loggged out successfully',
    };
  }

  async logoutAllSessions(
    user_id: string,
  ): Promise<{ data: null; message: string }> {
    await this.sessionsService.revokeAllUserSessions(user_id);

    return {
      data: null,
      message: 'Successfully Loggged out of all sessions',
    };
  }
}
