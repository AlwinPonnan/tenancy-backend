import {
  Body,
  Controller,
  Headers,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request } from 'express';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import type { RequestWithUser } from 'src/common/types/request-with-user';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Headers('user-agent') userAgent: string,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip;
    return this.authService.login(
      body.email,
      body.password,
      userAgent,
      ipAddress,
    );
  }

  
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(@Req() req) {
    return this.authService.refreshAuthToken(
      req.user.sessionId,
      req.user.version,
      req.user.userId,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  async logout(@Req() req: RequestWithUser) {
    return this.authService.logout(req.user.sessionId);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logoutAllSessions')
  async logoutAllSessions(@Req() req: RequestWithUser) {
    return this.authService.logoutAllSessions(req.user.userId);
  }
}
