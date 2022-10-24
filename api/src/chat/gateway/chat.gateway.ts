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
import { UserConnectionService } from '../../user/services/user-connection.service';
import { UserService } from '../../user/services/user.service';
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
    private readonly userConnectionService: UserConnectionService,
  ) {}

  private disconnect(socket: Socket): void {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    await this.userConnectionService.deleteBySocketId(socket.id);
    socket.disconnect();
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

      await this.userConnectionService.create(user.id, {
        socketId: socket.id,
        type: 'CHAT',
      });

      return this.server.to(socket.id).emit('rooms', rooms);
    } catch (e) {
      this.disconnect(socket);
    }
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: CreateRoomDto): Promise<void> {
    await this.chatService.createRoom(room, socket.data.user.id);
    const rooms = await this.chatService.getRoomsForUser(socket.data.user.id);

    this.server.to(socket.id).emit('rooms', rooms);
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(socket: Socket, roomId: number): Promise<void> {
    await this.chatService.addUserToRoom(socket.data.user.id, roomId);
  }
}
