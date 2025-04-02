import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ErrorResponseDto } from 'src/dto/common/error.response.dto';
import { ExceptionCode } from 'src/enums/custom.exception.code';

@Injectable()
export class RedisService {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });
  }

  // save key value
  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.redis.set(key, value, 'EX', ttl);
      } else {
        await this.redis.set(key, value);
      }
    } catch (error) {
      throw new ErrorResponseDto(
        ExceptionCode.REDIS_OPERATION_ERROR,
        `Failed to set key ${key}`,
      );
    }
  }

  // get key value
  async get(key: string): Promise<string | null> {
    try {
      return await this.redis.get(key);
    } catch (error) {
      throw new ErrorResponseDto(
        ExceptionCode.REDIS_OPERATION_ERROR,
        `Failed to get key ${key}`,
      );
    }
  }

  // delete key value
  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      throw new ErrorResponseDto(
        ExceptionCode.REDIS_OPERATION_ERROR,
        `Failed to delete key ${key}`,
      );
    }
  }
}
