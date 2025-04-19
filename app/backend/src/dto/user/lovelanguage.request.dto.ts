import { IsNumber, Max, Min } from 'class-validator';

export class UserLoveLanguageDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  words_of_affirmation: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  acts_of_service: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  receiving_gifts: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  quality_time: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  physical_touch: number;
}
