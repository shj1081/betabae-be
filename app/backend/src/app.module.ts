import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { FileModule } from './modules/file/file.module';
import { MatchModule } from './modules/match/match.module';
import { UserModule } from './modules/user/user.module';
import { FeedModule } from './modules/feed/feed.module';
import { LlmModule } from './modules/llm/llm.module';

@Module({
  imports: [AuthModule, UserModule, FileModule, MatchModule, ChatModule, FeedModule, LlmModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
