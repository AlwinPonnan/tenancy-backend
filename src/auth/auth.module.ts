import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { UsersRepository } from 'src/users/users.repository';
import { DatabaseService } from 'src/database/database.service';
import { JwtModule } from '@nestjs/jwt';
import { PasswordService } from 'src/common/security/password.service';
import { JwtTokenService } from './jwt-token.service';
import { SessionsService } from 'src/sessions/sessions.service';
import { SessionsRepository } from 'src/sessions/sessions.repository';
import { RedisService } from 'src/common/redis/redis.service';
import { LoginRateLimitMiddleware } from 'src/common/middleware/login-rate-limit.middleware';
import { RateLimiterModule } from 'src/common/rate-limiter/  rate-limiter.module';

@Module({
    controllers: [AuthController],
    providers: [
      AuthService,  
      // JwtTokenService, 
      ConfigService,
      PasswordService,
      UsersRepository, 
      SessionsRepository,
      UsersService,
      SessionsService,
      JwtTokenService,
      RedisService,
      DatabaseService,
      LoginRateLimitMiddleware
    ],
    imports:[
      JwtModule.register({}),
      RateLimiterModule
  ]
})
export class AuthModule implements NestModule{
   configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoginRateLimitMiddleware)
      .forRoutes('auth/login');
  }
}
