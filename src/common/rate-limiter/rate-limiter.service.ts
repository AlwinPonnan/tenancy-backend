import { ForbiddenException, Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class RateLimiterService {
  constructor(private readonly redis: RedisService) {}

  async consume(key: string, limit: number, window: number) {
    const count = await this.redis.incr(key);

    if (count === 1) {
      await this.redis.expire(key, window);
    }

    let expiry = await this.redis.ttl(key);
    const reset = expiry > 0 ? expiry : window;
    return {
      allowed: count <= limit,
      remaining:  Math.max(limit - count, 0),
      reset: reset,
    };
  }
}
