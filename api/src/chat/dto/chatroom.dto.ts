import { ChatRoom, User, UserChatRoom } from '@prisma/client';
import { IsString } from 'class-validator';
import { ChatMessageWithAuthor } from './message.dto';

export class CreateChatRoomDto {
  @IsString()
  name: string;
}

export type ChatRoomWithMessages = ChatRoom & {
  messages: ChatMessageWithAuthor[];
  users: (UserChatRoom & { user: User })[];
};
