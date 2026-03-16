import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtTokenService } from 'src/auth/jwt-token.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('TOKEN_MISSING');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('INVALID_TOKEN_FORMAT');
    }

    const payload = await this.jwtTokenService.verifyAccessToken(token);
    console.log(payload, "payload")
    request.user = {
      userId: payload.sub,
      sessionId: payload.sid,
    };

    return true;
  }
}