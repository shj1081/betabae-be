import { Gender, MBTI } from '@prisma/client';
import { Expose, Transform, Type } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  name: string;

  // @Expose()
  // @Transform(({ value }) => value?.toISOString())
  // created_at: Date;

  // @Expose()
  // @Transform(({ value }) => value?.toISOString())
  // updated_at: Date;

  // password_hash is implicitly excluded since it's not decorated with @Expose
}

export class ProfileDto {
  @Expose()
  introduce?: string;

  @Expose()
  age: number;

  @Expose()
  gender: Gender;

  @Expose()
  mbti?: MBTI;

  @Expose()
  @Transform(({ value }) =>
    typeof value === 'string' && value !== '' ? value.split(',') : [],
  )
  interests: string[];

  @Expose()
  province: string;

  @Expose()
  city: string;

  @Expose()
  profile_image_url?: string;

  // Omitting timestamps to reduce redundancy
  // created_at and updated_at are already in the parent user object
}

export class UserProfileResponseDto {
  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  @Type(() => ProfileDto)
  profile: ProfileDto;
}
