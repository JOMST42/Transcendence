import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Queue } from '../data/classes';
import { PongServerGateway } from '../gateway/pong-server.gateway';
import { Response } from '../data/interfaces';
import { PongRoomService } from './pong-room.service';
import { Timer } from 'src/pong/data/classes';
import { TimerType } from 'src/pong/data/enums';

class Invite {
  p1: Socket;
  p2: Socket;
  accepted: boolean;

  expirationTimer: Timer;
}

class InviteConfig {
  maxEntries = 100;
  expirationTime = 25;

  checkDuplicate = true;
  checkMax = true;
  checkInGame = true;
}

Injectable({});
export class PongInviteService {
  private logger: Logger = new Logger('PongInvite');

  private config = new InviteConfig();
  private inviteList: Invite[] = [];
  private disconnectListener: any;

  constructor(
    @Inject(forwardRef(() => PongRoomService))
    private roomService: PongRoomService,
    @Inject(forwardRef(() => PongServerGateway))
    private pongServer: PongServerGateway,
  ) {
    setInterval(() => {
      this.updateInvite();
    }, 2000);
  }

  private async updateInvite() {
    this.cullAllInvalid();
    const invite = this.getNextReady();
    if (!invite || !this.roomService.canCreateGameRoom()) {
      return;
    }
    await this.roomService.createGameRoom(invite.p1, invite.p2).then(() => {
      this.cullInvite(invite);
    });
  }

  getNextReady(): Invite | undefined {
    return this.inviteList.find((invite) => this.checkReady(invite));
  }

  setAcceptListener(socket: Socket) {
    socket.once('accept-invite', (args, callback) => {
      const response = this.acceptInvite(socket);
      if (typeof callback === 'function') callback(response);
    });
  }

  setRefuseListener(socket: Socket) {
    socket.once('refuse-invite', (args, callback) => {
      const response = this.refuseInvite(socket);
      if (typeof callback === 'function') callback(response);
    });
  }

  userInvite(socket: Socket, targetSocket: Socket): Response {
    let invite: Invite;
    invite = this.hasInvitation(socket.data.user.id);
    if (invite) {
      return {
        code: 1,
        msg:
          'You have a pending invitation already with player ' +
          targetSocket.data.user.displayName,
      };
    }
    invite = {
      p1: socket,
      p2: targetSocket,
      accepted: false,
      expirationTimer: new Timer(
        TimerType.STOPWATCH,
        0,
        this.config.expirationTime,
      ),
    };
    if (this.inviteList.length === this.inviteList.push(invite)) {
      return {
        code: 1,
        msg: 'Could not process your invitation. Try again later',
      };
    }
    invite.expirationTimer.start();
    this.logger.debug('Invite event: Queue size: ' + this.inviteList.length);
    this.setAcceptListener(targetSocket);
    this.setRefuseListener(targetSocket);
    targetSocket.emit('player-invite', socket.data.user.id);
    return { code: 0, msg: 'Your invitation has been sent!' };
  }

  acceptInvite(socket: Socket): Response {
    let response: Response = { code: 1, msg: '' };
    const invite = this.getPendingInviteOfUser(socket.data.user.id);
    if (invite) {
      invite.accepted = true;
      response = { code: 0, msg: 'You have accepted the invitation.' };
      invite.p1.emit('invite-accepted', {
        code: 0,
        msg: 'Your invitation has been accepted!',
      });
    }
    if (response.code !== 0)
      return { code: 1, msg: 'Currently, there is no invitation for you' };
    invite.expirationTimer.stop();
    this.logger.debug('Invitation accepted event');
    return {
      code: 0,
      msg: 'Invitation accepted! You are now in queue together.',
    };
  }

  isQueued(userId: number): boolean {
    const invite = this.hasInvitation(userId);
    if (invite) {
      if (invite.accepted) {
        return true;
      }
    }
    return false;
  }

  hasInvitation(userId: number): Invite | undefined {
    const invite = this.inviteList.find((invite: Invite) => {
      if (invite.p1?.data?.user?.id === userId) return true;
      if (invite.p2?.data?.user?.id === userId) return true;
      return false;
    });
    return invite;
  }

  getPendingInviteOfUser(userId: number): Invite | undefined {
    const invite = this.inviteList.find((invite: Invite) => {
      if (invite.p2?.data?.user?.id === userId) return true;
      return false;
    });
    return invite;
  }

  refuseInvite(socket: Socket): Response {
    const invite = this.hasInvitation(socket.data.user.id);
    if (invite) {
      this.cullInvite(invite);
      invite.p1.emit('invite-cancel', 'The invitation has been cancelled.');
      invite.p2.emit('invite-cancel', 'The invitation has been cancelled.');
      return { code: 0, msg: 'The invitation has been cancelled' };
    }
    return { code: 1, msg: 'You have no active invitation to cancel' };
  }

  queueSuccess(socket: Socket) {
    socket.to(socket.data.userRoom).emit('queue-success', 'Game created');
    this.clearListeners(socket);
    socket.data.queueTimer.stop();
  }

  getListSize(): number {
    return this.inviteList.length;
  }

  checkReady(invite: Invite): boolean {
    let res: Response;
    res = this.checkInvalid(invite);
    if (invite.accepted && res.code === 0) return true;
    return false;
  }

  checkInvalid(invite: Invite): Response {
    if (invite.expirationTimer.reachedEndtime())
      return { code: 1, msg: 'Invitation expired' };
    if (invite.p1.disconnected || invite.p2.disconnected)
      return { code: 1, msg: 'Player disconnected' };
    return { code: 0, msg: 'Invitation is valid' };
  }

  checkAndWarnInvalid(invite: Invite): boolean {
    const response: Response = this.checkInvalid(invite);
    if (response.code != 0) {
      if (invite.p1.connected)
        invite.p1.emit('invite-cancel', 'The invitation has been refused.');
      if (invite.p2.connected)
        invite.p2.emit('invite-cancel', 'The invitation has been refused.');
      return true;
    }
    return false;
  }

  cullInvite(invite: Invite) {
    const i = this.inviteList.indexOf(invite);
    if (i < 0) return;
    this.inviteList.splice(i, 1);
  }

  cullAllInvalid() {
    let i = 0;
    while (i < this.inviteList.length) {
      if (this.checkAndWarnInvalid(this.inviteList[i])) {
        this.inviteList.splice(i, 1);
      } else i++;
    }
  }

  cullAll() {
    this.inviteList = [];
  }

  clearListeners(socket: Socket) {
    socket.removeAllListeners('accept-invite');
    socket.removeAllListeners('cancel-invite');
  }
}
