import { ChatRoom, User, UserChatRoom } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';
import { ChatMessageWithAuthor } from './message.dto';

export class CreateChatRoomDto {
  @IsString()
  name: string;
}

export class AddUserToChatRoomDto {
  @IsString()
  roomId: string;

  @IsNumber()
  userId: number;
}

export type ChatRoomWithMessages = ChatRoom & {
  messages: ChatMessageWithAuthor[];
  users: (UserChatRoom & { user: User })[];
};
