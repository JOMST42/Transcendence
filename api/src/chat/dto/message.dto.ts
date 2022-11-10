import { ChatMessage, User } from '@prisma/client';
import { IsString } from 'class-validator';

export class CreateChatMessageDto {
  @IsString()
  content: string;
}

export class SendChatMessageDto {
  @IsString()
  roomId: string;

  @IsString()
  content: string;
}

export type ChatMessageWithAuthor = ChatMessage & { author: User };
