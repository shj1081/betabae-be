import { IsArray, ArrayMinSize, ArrayMaxSize, IsInt, Min, Max } from 'class-validator';

export class PersonalitySurveyScoreRequestDto {
  @IsArray()
  @ArrayMinSize(5)
  @ArrayMaxSize(5)
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(5, { each: true })
  answers: number[];
}
