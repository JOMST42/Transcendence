import { UserGameState, InviteState, QueueState } from '../enums';

export interface UserState {
  queue: QueueState;
  game: UserGameState;
  invite: InviteState;
}
