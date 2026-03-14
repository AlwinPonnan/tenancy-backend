import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RateLimiterService } from '../../common/rate-limiter/rate-limiter.service';
import * as crypto from 'crypto';
@Injectable()
export class LoginRateLimitMiddleware implements NestMiddleware {
  constructor(private readonly limiter: RateLimiterService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;

    const emailRaw = (req.body?.email || 'unknown').trim().toLowerCase();
    const emailHash = crypto
      .createHash('sha256')
      .update(emailRaw)
      .digest('hex');

    const ipKey = `login:ip:${ip}`;
    const emailKey = `login:email:${emailHash}`;
    const ipEmailKey = `login:ip-email:${ip}:${emailHash}`;
    console.log(ipKey, "ipkey")
    const ipResult = await this.limiter.consume(ipKey, 20, 60);
    const emailResult = await this.limiter.consume(emailKey, 5, 60);
    const ipEmailResult = await this.limiter.consume(ipEmailKey, 5, 60);

    if (!ipResult.allowed || !emailResult.allowed || !ipEmailResult.allowed) {
      throw new BadRequestException(
        'Too many login attempts. Please try again later.',
      );
    }

    next()
  }
}
