import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infra/prisma/prisma.module';
import { RedisModule } from 'src/infra/redis/redis.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
