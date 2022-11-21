import { User } from '../../user/models';

export interface ChatMessage {
  roomId: string;
  content: string;
  author?: User;
}
