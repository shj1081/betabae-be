import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FileModule } from '../file/file.module';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { LlmModule } from '../llm/llm.module';
import { ChatAnalysisService } from './chat-analysis.service';

@Module({
  imports: [FileModule, AuthModule, LlmModule],
  providers: [ChatService, ChatGateway, ChatAnalysisService],
  controllers: [ChatController],
  exports: [ChatService, ChatAnalysisService],
})
export class ChatModule {}
