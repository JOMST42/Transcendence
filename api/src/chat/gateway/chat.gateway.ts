import { UnauthorizedException } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
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
import { ChatService } from '../services/chat.service';
import { CreateRoomDto } from '../dto';
import { Room } from '@prisma/client';

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
    private readonly userConnectionService: UserConnectionService,
  ) {}

  private disconnect(socket: Socket): void {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket): Promise<void> {
    await this.userConnectionService.deleteBySocketId(socket.id);
    socket.disconnect();
  }

  async handleConnection(@ConnectedSocket() socket: Socket): Promise<boolean> {
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

      for (const room of rooms) {
        socket.join(room.id);
      }

      return this.server.to(socket.id).emit('rooms', rooms);
    } catch (e) {
      this.disconnect(socket);
    }
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(
    @MessageBody() dto: CreateRoomDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<Room> {
    try {
      return await this.chatService.createRoom(dto, socket.data.user.id);
    } catch (e) {
      this.server
        .to(socket.id)
        .emit('socketError', { message: 'Failed to create room' });
    }
  }
}
