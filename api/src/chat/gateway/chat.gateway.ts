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
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly chatService: ChatService,
  ) {}

  private disconnect(socket: Socket): void {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

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

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: CreateRoomDto): Promise<Room> {
    return this.chatService.createRoom(room, socket.data.user.id);
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(socket: Socket, roomId: number): Promise<Room> {
    return this.chatService.addUserToRoom(socket.data.user.id, roomId);
  }
}
