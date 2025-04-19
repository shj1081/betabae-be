import { Expose, Transform } from 'class-transformer';

export class UserPersonalityResponseDto {
  @Expose()
  id: number;

  @Expose()
  user_id: number;
  
  @Expose()
  openness: number;
  
  @Expose()
  conscientiousness: number;
  
  @Expose()
  extraversion: number;
  
  @Expose()
  agreeableness: number;
  
  @Expose()
  neuroticism: number;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  updated_at: Date;
  
  // No need to explicitly exclude other fields
  // Only fields with @Expose will be included when using plainToInstance
}
