import { Expose } from 'class-transformer';

export class PersonalitySurveyScoreResponseDto {
  @Expose()
  personality: any; // 실제 구조에 맞게 교체 가능
}
