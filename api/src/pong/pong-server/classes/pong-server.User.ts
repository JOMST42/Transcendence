import { Socket } from 'socket.io';

export class User {
  socket!: Socket;
  private id!: number;

  constructor(id: number, socket: Socket) {
    // this.setPlayer(player);
    this.socket = socket;
    this.id = id;
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

  getId(): number {
    return this.id;
  }
}
