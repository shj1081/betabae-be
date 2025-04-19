import { Expose } from 'class-transformer';

export class LoveLanguageSurveyScoreResponseDto {
  @Expose()
  loveLanguage: any; // 실제 구조에 맞게 교체 가능
}
