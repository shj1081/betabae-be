import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { UserModule } from '../user/user.module';
import { FeedService } from './feed.service';

@Module({
  imports: [UserModule],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
