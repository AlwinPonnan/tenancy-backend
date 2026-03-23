import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { JwtAccessPayload } from './types/jwt-access-payload.type';
import { JwtRefreshPayload } from './types/jwt-refresh-payload.type';

@Injectable()
export class JwtTokenService {
  private accessSecret: string;
  private refreshSecret: string;
  private accessTtl: number;
  private refreshTtl: number;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.accessSecret = this.configService.getOrThrow<string>(
      'auth.accessTokenSecret',
    );
    this.refreshSecret = this.configService.getOrThrow<string>(
      'auth.refreshTokenSecret',
    );

    this.accessTtl = this.configService.getOrThrow<number>(
      'auth.accessTokenTtl',
    );
    this.refreshTtl = this.configService.getOrThrow<number>(
      'auth.refreshTokenTtl',
    );
  }

  async signAccessToken(user_id: string, sessionId: string): Promise<string> {
    const payload: JwtAccessPayload = {
      sub: user_id,
      sid: sessionId,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.accessSecret,
      expiresIn: Math.floor(this.accessTtl / 1000),
      algorithm: 'HS256',
    });
  }

  async signRefreshToken(
    user_id: string,
    sessionId: string,
    token_version: number,
  ): Promise<string> {
    const payload: JwtRefreshPayload = {
      sub: user_id,
      sid: sessionId,
      ver: token_version,
    };


    return this.jwtService.signAsync(payload, {
      secret: this.refreshSecret,
      expiresIn: Math.floor(this.refreshTtl / 1000),
      algorithm: 'HS256',
    });
  }

  async verifyAccessToken(token: string): Promise<JwtAccessPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtAccessPayload>(token, {
        secret: this.accessSecret,
        algorithms: ['HS256'],
      });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('ACCESS_TOKEN_EXPIRED');
      }

      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('INVALID_ACCESS_TOKEN');
      }

      throw new UnauthorizedException('TOKEN_VERIFICATION_FAILED');
    }
  }

  async verifyRefreshToken(token: string): Promise<JwtRefreshPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtRefreshPayload>(token, {
        secret: this.refreshSecret,
        algorithms: ['HS256'],
      });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('REFRESH_TOKEN_EXPIRED');
      }

      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('INVALID_REFRESH_TOKEN');
      }

      throw new UnauthorizedException('TOKEN_VERIFICATION_FAILED');
    }
  }

  decodeToken(token: string): JwtRefreshPayload | null {
    return this.jwtService.decode<JwtRefreshPayload>(token);
  }
}
