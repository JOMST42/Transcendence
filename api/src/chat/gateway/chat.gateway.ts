import { UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Room } from '@prisma/client';
import { Server, Socket } from 'socket.io';

import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../user/user.service';
import { ChatService } from '../chat.service';
import { CreateRoomDto } from '../dto';

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200' },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly chatService: ChatService,
  ) {}

  handleDisconnect(socket: Socket): void {
    console.log('Disconnect');
  }

  async handleConnection(socket: Socket): Promise<boolean> {
    try {
      const payload = await this.authService.decodeToken(
        socket.handshake.headers.authorization,
      );
      const user = await this.userService.getUserById(payload.sub);

      if (!user) {
        this.disconnect(socket);
        return;
      }

      socket.data.user = user;
      const rooms = await this.chatService.getRoomsForUser(user.id);

      return this.server.to(socket.id).emit('rooms', rooms);
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

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: CreateRoomDto): Promise<Room> {
    return this.chatService.createRoom(room, socket.data.user.id);
  }
}
