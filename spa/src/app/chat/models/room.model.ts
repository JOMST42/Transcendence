import { User } from '../../user/models';
import { ChatMessage } from './chat-message.model';

export interface Room {
  id?: number;
  name?: string;
  users?: User[];
  messages?: ChatMessage[];
}
