import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ConversationType } from '@prisma/client';
import { parse } from 'cookie';
import { Server, Socket } from 'socket.io';
import { RedisService } from 'src/infra/redis/redis.service';
import { ChatService } from './chat.service';

/// Socket.io에서 사용하는 Socket 인터페이스 확장
interface AuthenticatedSocket extends Socket {
  userId?: number;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: 'chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly redisService: RedisService,
  ) {}

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // 클라이언트에서 전달한 session_id 조회
      const sessionId = parse(client.request.headers.cookie || '').session_id;
      // client.request 구조체 출력
      
      if (!sessionId) {
        console.log('No session_id in cookies; disconnecting');
        client.disconnect();
        return;
      }

      // Redis에서 세션 조회
      const sessionKey = `session:${sessionId}`;
      const sessionData = await this.redisService.get(sessionKey);
      if (!sessionData) {
        console.log('Session not found in Redis; disconnecting');
        client.disconnect();
        return;
      }

      // 유저 정보 파싱
      const userData = JSON.parse(sessionData) as { id: string; email: string };
      client.userId = Number(userData.id);

      // 유저 전용 socket room join
      client.join(`user:${userData.id}`);
      console.log(`Client connected: ${client.id}, user: ${userData.id}`);
    } catch (error) {
      console.error('Error during connection:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // realbae에서만 사용
  // beta bae에서는 사용하지 않음 (llmService에서 처리)
  @SubscribeMessage('joinRoom')
  async joinRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: number },
  ) {
    if (!client.userId) {
      return { success: false, message: 'Unauthorized' };
    }

    try {
      const { conversationId } = data;
      const conversation =
        await this.chatService.getConversationEntity(conversationId);

      // BETA_BAE면 소켓 기능 사용 안 함 (Optional: 혹은 에러 처리)
      if (conversation.type === ConversationType.BETA_BAE) {
        return {
          success: false,
          message: 'BETABAE does not support WebSocket',
        };
      }

      // 대화방 join & unread 메시지 읽음 처리
      await this.chatService.markMessagesAsRead(client.userId, conversationId);
      client.join(`conversation:${conversationId}`);

      return {
        success: true,
        message: `Joined conversation ${conversationId} and marked messages as read`,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to join room',
      };
    }
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: number },
  ) {
    const { conversationId } = data;
    client.leave(`conversation:${conversationId}`);
    return { success: true };
  }

 
  @SubscribeMessage('sendMessage')
  async sendTextMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: number; messageText: string },
  ) {
    if (!client.userId) {
      return { success: false, message: 'Unauthorized' };
    }

    try {
      const { conversationId, messageText } = data;
      // conversation 조회
      const conversation =
        await this.chatService.getConversationEntity(conversationId);
      if (conversation.type === ConversationType.BETA_BAE) {
        return {
          success: false,
          message: 'BETABAE does not support WebSocket',
        };
      }

      // 실시간 메시지 전송
      const message = await this.chatService.sendTextMessage(
        client.userId,
        conversationId,
        messageText,
      );

      // 대화방에 broadcast
      this.server
        .to(`conversation:${conversationId}`)
        .emit('newMessage', message);

      // 상대방에게 알림
      const conversationData =
        await this.chatService.getConversationWithUsers(conversationId);
      if (conversationData) {
        const otherUserId =
          client.userId === conversationData.requesterUserId
            ? conversationData.requestedUserId
            : conversationData.requesterUserId;
        this.server.to(`user:${otherUserId}`).emit('messageNotification', {
          conversationId,
          message,
        });
      }

      return { success: true, message };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to send message',
      };
    }
  }
}
