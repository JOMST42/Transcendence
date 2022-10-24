import { Socket } from 'socket.io';

export class User {
  socket!: Socket;

  constructor(socket: Socket) {
    // this.setPlayer(player);
    if (socket) this.socket = socket;
  }

  compareUser(user: User): boolean {
    if (user.getSocket() && user.getSocket() === this.getSocket()) return true;
    return false;
  }

  setSocket(socket: Socket) {
    if (socket) this.socket = socket;
    return this.socket;
  }

  getSocket(): Socket {
    return this.socket;
  }
}
