import { Socket } from 'socket.io';

export class Player {
  userId?: any;
  socket?: Socket;
  ready = false;
  disc_timer = 60000; // ms
  disc_n = 0; // amount of disconnections

  constructor(userId: any) {
    this.userId = userId;
  }
}
