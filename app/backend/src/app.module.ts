import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { PrismaModule } from './infra/prisma/prisma.module';
import { S3Module } from './infra/s3/s3.module';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { FileModule } from './modules/file/file.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, S3Module, FileModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
