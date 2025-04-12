import { ConversationType } from '@prisma/client';
import { Expose, Transform, Type } from 'class-transformer';
import { MessageResponseDto } from './message.response.dto';

export class ChatPartnerDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  profileImageUrl?: string;
}

export class ConversationResponseDto {
  @Expose()
  conversationId: number;

  @Expose()
  matchId: number;

  @Expose()
  type: ConversationType;

  @Expose()
  @Type(() => ChatPartnerDto)
  chatPartner: ChatPartnerDto;

  @Expose()
  unreadCount: number;

  @Expose()
  @Type(() => MessageResponseDto)
  lastMessage?: MessageResponseDto;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  createdAt: Date;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  updatedAt: Date;
}

export class ConversationListResponseDto {
  @Expose()
  @Type(() => ConversationResponseDto)
  conversations: ConversationResponseDto[];

  @Expose()
  totalUnreadCount: number;
}
