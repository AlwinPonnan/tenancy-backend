import { Injectable } from '@nestjs/common'
import Redis from 'ioredis'

@Injectable()
export class RedisService {
  private client: Redis

  constructor() {
    this.client = new Redis({
      host: '127.0.0.1',
      port: 6379
    })
  }

  async incr(key: string) {
    return this.client.incr(key)
  }

  async expire(key: string, seconds: number) {
    return this.client.expire(key, seconds)
  }

  async get(key: string) {
    return this.client.get(key)
  }

  async ttl(key: string) {
    return this.client.ttl(key)
  }

  async set(key: string, value: string) {
    return this.client.set(key, value)
  }
}