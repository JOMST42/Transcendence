import { User } from '../../user/models';
import { ChatMessage } from './chat-message.model';

export interface UserChatRoom {
  userId?: number;
  roomId?: string;
  isOwner?: boolean;
  role?: 'ADMIN' | 'USER';
  user?: User;
}

export interface Room {
  id?: string;
  name?: string;
  users?: UserChatRoom[];
  messages?: ChatMessage[];
  visibility?: 'PUBLIC' | 'PRIVATE';
  password?: string;
  isProtected?: boolean;
}

export interface BanUserDto {
  userId: number;
  roomId: string;
  time: Date;
}
