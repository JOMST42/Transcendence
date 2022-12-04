import { User } from '../../user/models';
import { ChatMessage } from '../models';

export function checkBlocked(msg: ChatMessage, blockedUsers: User[]): string {
  const blocked = blockedUsers.find((user) => {
    return msg.author.id === user.id;
  });

  if (blocked) {
    return '<message blocked>';
  } else {
    return msg.content;
  }
}
