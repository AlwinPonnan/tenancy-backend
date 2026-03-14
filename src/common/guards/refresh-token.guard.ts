import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtTokenService } from 'src/auth/jwt-token.service';
import { SessionsService } from 'src/sessions/sessions.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly sessionsService: SessionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader =
      request.headers.authorization || request.headers.Authorization;

    if (!authHeader) {
      throw new UnauthorizedException('TOKEN_MISSING');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('INVALID_TOKEN_FORMAT');
    }

    const payload = await this.jwtTokenService.verifyRefreshToken(token);

 
    request.user = {
      userId: payload.sub,
      sessionId: payload.sid,
      version: payload.ver,
    };

    return true;
  }
}
