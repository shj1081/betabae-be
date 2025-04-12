import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { SendMessageDto } from 'src/dto/chat/message.request.dto';
import { BasicResponseDto } from 'src/dto/common/basic.response.dto';
import { ErrorResponseDto } from 'src/dto/common/error.response.dto';
import { ExceptionCode } from 'src/enums/custom.exception.code';
import { AuthGuard } from '../auth/auth.guard';
import { ChatService } from './chat.service';

@Controller('chat/conversations')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getConversations(@Req() req: Request) {
    const userId = Number(req['user'].id);
    const conversations = await this.chatService.getConversations(userId);
    return new BasicResponseDto(
      'Conversations retrieved successfully',
      conversations,
    );
  }

  @Get(':conversationId')
  async getConversation(
    @Req() req: Request,
    @Param('conversationId', ParseIntPipe) conversationId: number,
  ) {
    const userId = Number(req['user'].id);
    const conversation = await this.chatService.getConversationEntity(
      conversationId,
      userId,
    );
    return new BasicResponseDto('Conversation retrieved', conversation);
  }

  @Get(':conversationId/messages')
  async getMessages(
    @Req() req: Request,
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Query('limit') limit?: number,
    @Query('before') before?: number,
  ) {
    const userId = Number(req['user'].id);
    const messages = await this.chatService.getMessages(
      userId,
      conversationId,
      limit ? Number(limit) : undefined,
      before ? Number(before) : undefined,
    );

    return new BasicResponseDto('Messages retrieved successfully', messages);
  }

  // REAL_BAE: DB에 저장 후 소켓 broadcast (게이트웨이에서 emit)
  // BETA_BAE: LLM 호출/응답을 포함 (service 내에서 분기)
  @Post(':conversationId/messages/text')
  async sendTextMessage(
    @Req() req: Request,
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Body() dto: SendMessageDto,
  ) {
    const userId = Number(req['user'].id);
    const message = await this.chatService.sendTextMessage(
      userId,
      conversationId,
      dto.messageText,
    );

    return new BasicResponseDto('Message processed successfully', message);
  }

  // 파일 첨부의 경우 api 분리
  @Post(':conversationId/messages/image')
  @UseInterceptors(FileInterceptor('file'))
  async sendImageMessage(
    @Req() req: Request,
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Body('messageText') messageText: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = Number(req['user'].id);

    if (!file) {
      throw new BadRequestException(
        new ErrorResponseDto(
          ExceptionCode.FILE_NO_CONTENT,
          'File not found in the request',
        ),
      );
    }

    const message = await this.chatService.sendImageMessage(
      userId,
      conversationId,
      file,
      messageText,
    );

    return new BasicResponseDto('Image message sent successfully', message);
  }
}
