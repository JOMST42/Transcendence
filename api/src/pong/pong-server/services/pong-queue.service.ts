import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Queue } from '../classes';
import { PongServerGateway } from '../gateway/pong-server.gateway';
import { Response } from '../interfaces';
import { PongRoomService } from './pong-room.service';

Injectable({});
export class PongQueueService {
  private logger: Logger = new Logger('PongQueue');

  private queue: Queue = new Queue();
  private maxEntries = 100;
  private disconnectListener: any;

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

  private updateQueue() {
    if (!this.queue.checkReady(2) || !this.roomService.canCreateGameRoom()) {
      return;
    }
    const users = this.queue.popN(2);
    this.queueSuccess(users[0]);
    this.queueSuccess(users[1]);
    const room = this.roomService.createGameRoom(users[0], users[1]).payload;
  }

  setListeners(user: Socket) {
    this.disconnectListener = () => {
      this.handleLeaveQueue(user);
    };

    user.on('disconnect', this.disconnectListener);

    user.on('leave-queue', (args, callback) => {
      const response = this.handleLeaveQueue(user);
      if (typeof callback === 'function') callback(response);
    });

    user.on('update-queue', (args, callback) => {
      const response = this.handleUpdateQueue(user);
      if (typeof callback === 'function') callback(response);
    });
  }

  userJoinQueue(user: Socket): Response {
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

  handleUpdateQueue(user: Socket): Response {
    //TODO
    return { code: 0, msg: 'queue update' };
  }

  handleLeaveQueue(user: Socket): Response {
    if (this.queue.unqueue(user)) {
      this.clearListeners(user);
      this.logger.log(
        'user ' + user.data.user.displayName + ' has left the queue',
      );
      return { code: 0, msg: 'you left the queue' };
    }
    return { code: 1, msg: 'you are not currently in a queue' };
  }

  queueSuccess(user: Socket) {
    user.emit('queue-success', 'Successfully matched');
    this.clearListeners(user);
  }

  getQueueSize(): number {
    return this.queue.length();
  }

  clearListeners(user: Socket) {
    user.off('disconnect', this.disconnectListener);
    user.removeAllListeners('leave-queue');
    user.removeAllListeners('update-queue');
  }
}
