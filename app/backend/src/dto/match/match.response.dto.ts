import { MatchStatus } from '@prisma/client';
import { Expose, Transform, Type } from 'class-transformer';

export class MatchUserInfoDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;
}

export class MatchResponseDto {
  @Expose()
  matchId: number;

  @Expose()
  @Type(() => MatchUserInfoDto)
  requester: MatchUserInfoDto;

  @Expose()
  @Type(() => MatchUserInfoDto)
  requested: MatchUserInfoDto;

  @Expose()
  status: MatchStatus;

  @Expose()
  requesterConsent: boolean;

  @Expose()
  requestedConsent: boolean;
  
  @Expose()
  @Transform(({ value }) => value?.toISOString())
  createdAt: Date;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  updatedAt: Date;
}
