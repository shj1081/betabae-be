import { IsNumber } from 'class-validator';

export class ChatAnalysisRequestDto {
  @IsNumber()
  messageId: number;
}
