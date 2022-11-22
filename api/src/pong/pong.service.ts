import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Response, RoomInfo } from './pong-server/data/interfaces';
import { PongRoomService } from './pong-server/services/pong-room.service';
import { PongInviteService } from './pong-server/services/pong-invite.service';
import { PongQueueService } from './pong-server/services/pong-queue.service';
import { UserState } from './data/interfaces';
import { UserGameState, InviteState, QueueState } from './data/enums';

@Injectable({})
export class PongService {
  logger: Logger = new Logger('PongService');

  constructor(
    private roomService: PongRoomService,
    private inviteService: PongInviteService,
    private queueService: PongQueueService,
  ) {}

  getUserState(userId: number): UserState {
    let states: UserState;
    let queue: QueueState = QueueState.NOTQUEUED;
    let game: UserGameState = UserGameState.OFFLINE;
    let invite: InviteState = InviteState.NONE;

    if (this.queueService.isUserQueued(userId)) queue = QueueState.QUEUED;

    if (this.inviteService.getPendingInviteOfUser(userId))
      invite = InviteState.PENDING;
    else if (this.inviteService.hasInvitation(userId))
      invite = InviteState.WAITING;
    else if (this.inviteService.isQueued(userId)) invite = InviteState.QUEUED;

    game = this.roomService.getUserGameState(userId);
    return (states = { queue: queue, game: game, invite: invite });
  }

  canQueue(userId: number): Response {
    const userState = this.getUserState(userId);
    if (userState.game != UserGameState.OFFLINE)
      return {
        code: 1,
        msg: 'You are currently in a game.',
        payload: userState,
      };
    if (userState.invite != InviteState.NONE)
      return {
        code: 1,
        msg: 'You have an active game invitation or matchmaking.',
        payload: userState,
      };
    if (userState.queue != QueueState.NOTQUEUED)
      return {
        code: 1,
        msg: 'You are already matchmaking.',
        payload: userState,
      };
    return { code: 0, msg: 'You can queue.', payload: userState };
  }

  canInvite(userId: number): Response {
    const userState = this.getUserState(userId);
    if (userState.game != UserGameState.OFFLINE) {
      return {
        code: 1,
        msg: 'You are currently in a game.',
        payload: userState,
      };
    }
    if (userState.queue != QueueState.NOTQUEUED) {
      return {
        code: 1,
        msg: 'You are currently in matchmaking queue.',
        payload: userState,
      };
    }
    if (userState.invite != InviteState.NONE) {
      return {
        code: 1,
        msg: 'You already have an active game invitation or matchmaking.',
        payload: userState,
      };
    }

    return { code: 0, msg: 'You can invite.', payload: userState };
  }

  canJoinGame(userId: number): Response {
    const userState = this.getUserState(userId);
    if (userState.queue != QueueState.NOTQUEUED) {
      return {
        code: 1,
        msg: 'You are currently in matchmaking queue.',
        payload: userState,
      };
    }
    if (userState.invite != InviteState.NONE) {
      return {
        code: 1,
        msg: 'You already have an active game invitation or matchmaking.',
        payload: userState,
      };
    }
    if (
      userState.game != UserGameState.OFFLINE &&
      userState.game != UserGameState.WAITING &&
      userState.game != UserGameState.RECONNECT
    ) {
      return {
        code: 1,
        msg: 'You are currently in a game.',
        payload: userState,
      };
    }
    if (
      userState.game === UserGameState.WAITING ||
      userState.game === UserGameState.RECONNECT
    ) {
      return {
        code: 0,
        msg: 'You have a game that needs you!',
        payload: userState,
      };
    }

    return { code: 1, msg: 'No games are waiting for you', payload: userState };
  }
}
