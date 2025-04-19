import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { LlmService } from '../llm/llm.service';
import { ChatAnalysisRequestDto } from 'src/dto/chat/chat-analysis.request.dto';
import { ChatAnalysisResponseDto } from 'src/dto/chat/chat-analysis.response.dto';

@Injectable()
export class ChatAnalysisService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly llmService: LlmService,
  ) {}

  async analyzeChat(dto: ChatAnalysisRequestDto, userId: number): Promise<ChatAnalysisResponseDto> {
    // 1. Find the message and its conversation
    const message = await this.prisma.message.findUnique({
      where: { id: dto.messageId },
      include: { conversation: true },
    });
    if (!message) throw new Error('Message not found');
    if (message.attachment_media_id) {
      // Custom exception for file/attachment in analysis request
      const { ErrorResponseDto } = await import('src/dto/common/error.response.dto');
      const { ExceptionCode } = await import('src/enums/custom.exception.code');
      throw new ErrorResponseDto(
        ExceptionCode.CHAT_ANALYSIS_FILE_NOT_SUPPORTED,
        'File/attachment messages are not supported for chat analysis.',
      );
    }
    const conversationId = message.conversation_id;

    // 2. Fetch the last 5 messages in the conversation, skipping those with attachments
    const messages = await this.prisma.message.findMany({
      where: {
        conversation_id: conversationId,
        attachment_media_id: null,
      },
      orderBy: { sent_at: 'desc' },
      take: 10,
    });
    // Reverse to chronological order
    const contextMessages = messages.reverse();
    const contextText = contextMessages.map(m => `[${m.sender_id}] ${m.message_text}`).join('\n');

    // 3. Send to LLM (mock)
    const llmRawResponse = await this.llmService.getAnswerFromBot(contextText);

    // 4. Return analysis result
    return {
      analysis: `Analysis message with previous 10 messages: ${llmRawResponse}`,
      llmRawResponse,
    };
  }
}
