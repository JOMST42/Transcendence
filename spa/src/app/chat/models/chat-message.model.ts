import { User } from '../../user/models';

export interface ChatMessage {
  roomId: number;
  message: string;
  author?: User;
}
