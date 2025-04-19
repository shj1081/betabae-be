import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedFilterDto } from 'src/dto/feed/feed-filter.dto';
import { FeedUserDto } from 'src/dto/feed/feed-user.dto';
import { BasicResponseDto } from 'src/dto/common/basic.response.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  /**
   * Get a list of highly compatible users, optionally filtered by criteria.
   *
   * @param filters - Filtering options such as age, gender, location, etc.
   * @returns The list of highly compatible users.
   */
  @UseGuards(AuthGuard)
  @Get()
  async getFeed(@Query() filters: FeedFilterDto, @Req() req: Request) {
    const currentUserId = Number(req['user'].id);
    const users: FeedUserDto[] = await this.feedService.getHighlyCompatibleUsers(currentUserId, filters);
    return new BasicResponseDto('Highly compatible users retrieved', users);
  }
}
