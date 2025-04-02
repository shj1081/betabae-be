import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { PrismaModule } from './infra/prisma/prisma.module';
import { S3Module } from './infra/s3/s3.module';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [AuthModule, PrismaModule, S3Module],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
