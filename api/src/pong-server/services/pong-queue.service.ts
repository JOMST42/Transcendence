import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Queue, User } from '../classes';
import { PongServerGateway } from '../gateway/pong-server.gateway';
import { Response } from '../interfaces';
import { PongRoomService } from './pong-room.service';

Injectable({});
export class PongQueueService {
  private logger: Logger = new Logger('PongQueue');

  private queue: Queue = new Queue();
  private max_users = 100;

  constructor(
    @Inject(forwardRef(() => PongRoomService))
    private roomService: PongRoomService,
    @Inject(forwardRef(() => PongServerGateway))
    private pongServer: PongServerGateway,
  ) {
    setInterval(() => {
      this.updateQueue();
    }, 2000); // every 2 seconds
  }

  // onInit() {
  //   setInterval(() => {
  //     this.updateQueue();
  //   }, 2000); // every 2 seconds
  // }

  private updateQueue() {
    if (!this.queue.check_n_ready(2) || !this.roomService.canCreateGameRoom()) {
      return;
    }
    const users = this.queue.pop_n_user(2);
    this.queueSuccess(users[0]);
    this.queueSuccess(users[1]);
    const room = this.roomService.createGameRoom(users[0], users[1]).payload;
  }

  setListeners(user: User) {
    user.socket?.on('leave-queue', (args, callback) => {
      callback(this.handleLeaveQueue(user));
    });

    user.socket?.on('update-queue', (args, callback) => {
      callback(this.handleUpdateQueue(user));
    });
  }

  userJoinQueue(user: User): Response {
    if (this.queue.is_queued(user)) {
      this.logger.debug('join-queue event: Already queued.');
      return { code: 1, msg: 'Already queued!' };
    } else if (!this.queue.push(user)) {
      this.logger.debug('join-queue event: Full queue.');
      return { code: 1, msg: 'queue is full!' };
    }
    this.setListeners(user);
    this.logger.debug('join-queue event: Queue size: ' + this.queue.length());
    return { code: 0, msg: 'you have joined the queue.' };
  }

  handleUpdateQueue(user: User): Response {
    //TODO
    return { code: 0, msg: 'queue update' };
  }

  handleLeaveQueue(user: User): Response {
    if (this.queue.unqueue(user)) {
      this.clearListeners(user);
      return { code: 0, msg: 'you left the queue' };
    }
    return { code: 1, msg: 'you are not currently in a queue' };
  }

  queueSuccess(user: User) {
    user.getSocket().emit('queue-success', 'Successfully matched');
    this.clearListeners(user);
  }

  getQueueSize(): number {
    return this.queue.length();
  }

  clearListeners(user: User) {
    user.socket?.removeAllListeners('leave-queue');
    user.socket?.removeAllListeners('update-queue');
  }
}
