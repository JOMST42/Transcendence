import { UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../user/user.service';

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authService: AuthService,
    private readonly userSerivce: UserService,
  ) {}

  handleDisconnect(socket: Socket) {
    console.log('Disconnect');
  }

  async handleConnection(socket: Socket) {
    try {
      const payload = await this.authService.decodeToken(
        socket.handshake.headers.authorization,
      );
      const user = await this.userSerivce.getUserById(payload.sub);

      if (!user) {
        this.disconnect(socket);
        return;
      }

      this.server.emit('message', 'test');
      console.log('Connect');
    } catch (e) {
      this.disconnect(socket);
    }
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  private disconnect(socket: Socket): void {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }
}
