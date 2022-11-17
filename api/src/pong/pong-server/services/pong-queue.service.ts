import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Queue } from '../data/classes';
import { PongServerGateway } from '../gateway/pong-server.gateway';
import { Response } from '../data/interfaces';
import { PongRoomService } from './pong-room.service';
import { Timer } from 'src/pong/data/classes';
import { TimerType } from 'src/pong/data/enums';

class QueueConfig {
  maxEntries = 100;

  checkDuplicate = false;
  checkMax = false;
  checkInGame = false;
}

Injectable({});
export class PongQueueService {
  private logger: Logger = new Logger('PongQueue');

  private config = new QueueConfig();
  private queue: Queue = new Queue(this.config.maxEntries);
  private disconnectListener: any;

  constructor(
    @Inject(forwardRef(() => PongRoomService))
    private roomService: PongRoomService,
    @Inject(forwardRef(() => PongServerGateway))
    private pongServer: PongServerGateway,
  ) {
    setInterval(() => {
      this.updateQueue();
    }, 5000);
  }

  /* TODO
   * Once the queue has 2 eligible players,
   * it should ask the room service to create a game room.
   *
   * It should then wait for its return to unqueue the users successfully
   */
  private async updateQueue() {
    if (!this.queue.checkReady(2) || !this.roomService.canCreateGameRoom()) {
      return;
    }
    const users = this.queue.fetchN(2);
    await this.roomService.createGameRoom(users[0], users[1]).then(() => {
      this.queue.popN(2);
      this.queueSuccess(users[0]);
      this.queueSuccess(users[1]);
    });
  }

  setListeners(socket: Socket) {
    this.disconnectListener = () => {
      this.handleLeaveQueue(socket);
    };

    socket.once('disconnect', this.disconnectListener);

    socket.on('leave-queue', (args, callback) => {
      const response = this.handleLeaveQueue(socket);
      if (typeof callback === 'function') callback(response);
    });

    socket.on('update-queue', (args, callback) => {
      const response = this.handleUpdateQueue(socket);
      if (typeof callback === 'function') callback(response);
    });
  }

  userJoinQueue(socket: Socket): Response {
    let response: Response;
    response = this.attemptJoinQueue(socket);
    if (response.code !== 0) return response;
    this.setListeners(socket);
    this.logger.debug('join-queue event: Queue size: ' + this.queue.length());
    return { code: 0, msg: 'you have joined the queue.' };
  }

  attemptJoinQueue(socket: Socket): Response {
    if (this.config.checkDuplicate && this.queue.isQueued(socket)) {
      this.logger.debug('join-queue event: socket is already queued');
      return { code: 1, msg: 'You are already queued' };
    } else if (!this.queue.push(socket)) {
      this.logger.debug('join-queue event: Full queue');
      return { code: 1, msg: 'The queue is full' };
    } // TODO check ingame
    // this.logger.debug('join-queue event: user is ingame.');
    // return { code: 1, msg: 'You are currently considered in-game' };
    return { code: 0, msg: 'You are allowed to queue' };
  }

  handleUpdateQueue(socket: Socket): Response {
    //TODO
    return { code: 0, msg: 'queue update' };
  }

  handleLeaveQueue(socket: Socket): Response {
    if (this.queue.unqueue(socket)) {
      this.clearListeners(socket);
      this.logger.log(
        'socket ' + socket.data.user?.displayName + ' has left the queue',
      );
      return { code: 0, msg: 'You left the queue' };
    }
    return { code: 1, msg: 'You are not currently in a queue' };
  }

  queueSuccess(socket: Socket) {
    socket
      .to(socket.data.userRoom)
      .emit('queue-success', 'Successfully matched');
    this.clearListeners(socket);
  }

  isUserQueued(userId: number): boolean {
    return this.queue.isUserQueued(userId);
  }

  getQueueSize(): number {
    return this.queue.length();
  }

  getQueueState(userId: number) {}

  clearListeners(socket: Socket) {
    try {
      socket.off('disconnect', this.disconnectListener);
    } catch (e) {}
    socket.removeAllListeners('leave-queue');
    socket.removeAllListeners('update-queue');
  }
}
