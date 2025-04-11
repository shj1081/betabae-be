import { IsNumber, Max, Min } from 'class-validator';

export class UserPersonalityDto {
  @IsNumber()
  @Min(0)
  @Max(5)
  openness: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  conscientiousness: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  extraversion: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  agreeableness: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  neuroticism: number;
}
