import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ErrorResponseDto } from 'src/dto/common/error.response.dto';
import { ExceptionCode } from 'src/enums/custom.exception.code';

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly redis: Redis;

  // redis connection managed by ioredis
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times: number) => Math.min(times * 50, 2000),
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
    });

    this.redis.on('error', (error) => {
      console.error('[RedisService] Redis error:', error.message);
    });
  }

  // check if initial redis connection is established
  async onModuleInit(): Promise<void> {
    try {
      await this.redis.ping();
      console.log('[RedisService] Redis is connected');
    } catch (error) {
      console.error(
        '[RedisService] Redis initial connection failed:',
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  // check if redis connection is established
  private checkConnection(): void {
    if (this.redis.status !== 'ready') {
      throw new HttpException(
        new ErrorResponseDto(
          ExceptionCode.REDIS_CONNECTION_ERROR,
          'Redis is not ready. Current status: ' + this.redis.status,
        ),
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  // handle redis error
  private handleRedisError(error: unknown, operation: string, key: string): never {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('ECONNREFUSED')) {
      throw new HttpException(
        new ErrorResponseDto(
          ExceptionCode.REDIS_CONNECTION_ERROR,
          `Redis connection refused during ${operation} for key ${key}`,
        ),
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    if (message.includes('NOAUTH')) {
      throw new HttpException(
        new ErrorResponseDto(ExceptionCode.REDIS_AUTH_ERROR, 'Redis authentication failed'),
        HttpStatus.UNAUTHORIZED,
      );
    }

    throw new HttpException(
      new ErrorResponseDto(
        ExceptionCode.REDIS_OPERATION_ERROR,
        `Redis ${operation} failed for key ${key}: ${message}`,
      ),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  // set key-value pair in redis
  async set(key: string, value: string, ttl?: number): Promise<void> {
    this.checkConnection();
    try {
      if (ttl) {
        await this.redis.set(key, value, 'EX', ttl);
      } else {
        await this.redis.set(key, value);
      }
    } catch (error: unknown) {
      this.handleRedisError(error, 'set', key);
    }
  }

  // get value from redis
  async get(key: string): Promise<string | null> {
    this.checkConnection();
    try {
      return await this.redis.get(key);
    } catch (error: unknown) {
      this.handleRedisError(error, 'get', key);
    }
  }

  // delete key-value pair from redis
  async del(key: string): Promise<void> {
    this.checkConnection();
    try {
      await this.redis.del(key);
    } catch (error: unknown) {
      this.handleRedisError(error, 'delete', key);
    }
  }
}
