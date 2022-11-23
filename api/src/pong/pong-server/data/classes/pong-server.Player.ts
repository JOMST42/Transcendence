import { Socket } from 'socket.io';
import { Timer } from 'src/pong/data/classes';
import { TimerType } from 'src/pong/data/enums';

export class Player {
  userId?: any;
  socket?: Socket;
  ready = false;
  joined = false;
  disc_timer = new Timer(TimerType.COUNTDOWN, 20, 0); // ms

  constructor(userId: any) {
    this.userId = userId;
  }
}
