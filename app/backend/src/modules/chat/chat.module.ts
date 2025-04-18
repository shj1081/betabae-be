import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FileModule } from '../file/file.module';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService, LlmService } from './chat.service';

@Module({
  imports: [FileModule, AuthModule],
  providers: [ChatService, ChatGateway, LlmService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
