import { Injectable } from '@nestjs/common';
import { FeedFilterDto } from 'src/dto/feed/feed-filter.dto';
import { FeedUserDto } from 'src/dto/feed/feed-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class FeedService {
  constructor(private readonly userService: UserService) {}

  async getHighlyCompatibleUsers(currentUserId: number, filters: FeedFilterDto): Promise<FeedUserDto[]> {
    // Fetch all users except the current user
    const users = await this.userService.getAllUsersExcept(currentUserId);
    // Map to FeedUserDto with mock compatibilityScore
    const feedUsers: FeedUserDto[] = users.map((user: any) => ({
      id: user.id,
      nickname: user.profile?.nickname || '',
      age: user.profile?.birthday ? this.getAgeFromBirthday(user.profile.birthday) : 0,
      gender: user.profile?.gender || '',
      city: user.profile?.city || '',
      province: user.profile?.province || '',
      profileImageUrl: user.profile?.profile_image?.file_url || null,
      compatibilityScore: Math.floor(Math.random() * 21) + 80, // mock: 80~100
    }));
    // Apply filtering
    return feedUsers.filter(user => {
      if (filters.age && user.age !== filters.age) return false;
      if (filters.gender && user.gender !== filters.gender) return false;
      if (filters.location && user.city !== filters.location && user.province !== filters.location) return false;
      return true;
    });
  }

  private getAgeFromBirthday(birthday: string | Date): number {
    const birth = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }
}

