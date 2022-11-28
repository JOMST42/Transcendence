import {
  ChatRole,
  ChatRoom,
  ChatRoomVisibility,
  User,
  UserChatRoom,
} from '@prisma/client';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ChatMessageWithAuthor } from './message.dto';

export class CreateChatRoomDto {
  @IsString()
  name: string;

  @IsString()
  visibility: ChatRoomVisibility;

  @IsOptional()
  @IsString()
  password: string;
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

export class BanUserDto {
  @IsNumber()
  userId: number;

  @IsString()
  roomId: string;

  time: Date;
}

export class ChangePasswordDto {
  @IsString()
  password: string;
}

export class ChangeRoleDto {
  @IsNumber()
  userId: number;

  @IsString()
  role: ChatRole;
}
