import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { FileModule } from './modules/file/file.module';
import { MatchModule } from './modules/match/match.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [AuthModule, UserModule, FileModule, MatchModule, ChatModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
