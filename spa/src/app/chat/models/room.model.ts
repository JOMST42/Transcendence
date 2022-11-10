import { User } from '../../user/models';
import { ChatMessage } from './chat-message.model';

export interface UserChatRoom {
  userId?: number;
  roomId?: number;
  isOwner?: boolean;
  user?: User;
}

export interface Room {
  id?: number;
  name?: string;
  users?: UserChatRoom[];
  messages?: ChatMessage[];
}
