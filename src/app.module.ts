import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ProjectsModule } from './projects/projects.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config';
import { SessionsModule } from './sessions/sessions.module';
import Joi from 'joi';
import { RedisModule } from './common/redis/redis.module';
import { MembershipsModule } from './memberships/memberships.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  
  imports: [
     LoggerModule.forRoot({
      pinoHttp: {
        level: 'info',

        transport: process.env.NODE_ENV !== 'production'
          ? {
              target: 'pino-pretty',
              options: {
                singleLine: true,
                colorize: true,
              },
            }
          : undefined,

        genReqId: (req) => {
          return Math.random().toString(36).substring(2, 10);
        },

        customLogLevel: (req, res, err) => {
          if (res.statusCode >= 500 || err) return 'error';
          if (res.statusCode >= 400) return 'warn';
          return 'info';
        },
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: configuration,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_MAX_CONNECTIONS: Joi.string().required(),
        ACCESS_TOKEN_TTL: Joi.string().required(),
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_TTL: Joi.string().required(),
        BCRYPT_COST: Joi.number().default(12),
        RETRY_COUNT: Joi.number().required(),
      }),
    }),
    AuthModule,
    UsersModule,
    OrganizationsModule,
    ProjectsModule,
    DatabaseModule,
    SessionsModule,
    RedisModule,
    OrganizationsModule,
    MembershipsModule
  ],
})
export class AppModule {}
