import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()

// TODO: refine error handling
export class RedisService {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
    });
  }

  // save key value
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redis.set(key, value, 'EX', ttl);
    } else {
      await this.redis.set(key, value);
    }
  }

  // get key value
  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  // delete key value
  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
