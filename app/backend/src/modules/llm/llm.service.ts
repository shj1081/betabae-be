import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
import { ErrorResponseDto } from 'src/dto/common/error.response.dto';
import { ExceptionCode } from 'src/enums/custom.exception.code';

@Injectable()
export class LlmService {

  // TODO: impl llm service
  async getAnswerFromBot(userMessage: string): Promise<string> {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new InternalServerErrorException(
        new ErrorResponseDto(ExceptionCode.OPENAI_ERROR, 'OpenAI API key is not set in environment variables'));
    }
    const openai = new OpenAI({ apiKey });
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'user', content: userMessage }
      ],
    });
    return response.choices[0]?.message?.content || '죄송합니다. 답변을 찾을 수 없습니다.';
  }
}
