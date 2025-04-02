import { Module } from '@nestjs/common';

import { PrismaModule } from './infra/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
