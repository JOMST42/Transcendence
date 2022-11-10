import { User } from '../../user/models';

export interface ChatMessage {
  roomId: number;
  content: string;
  author?: User;
}
