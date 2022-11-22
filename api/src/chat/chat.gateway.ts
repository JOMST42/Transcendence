import { BadRequestException, UnauthorizedException } from '@nestjs/common';
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

import { AuthService } from '../auth/auth.service';
import { UserConnectionService } from '../user/services/user-connection.service';
import { UserService } from '../user/services/user.service';
import { ChatService } from './chat.service';
import { AddUserToChatRoomDto } from './dto';
import { ChatMessageWithAuthor, SendChatMessageDto } from './dto/message.dto';

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
    socket.emit('socketError', { message: 'Unauthorized' });
    socket.disconnect();
  }

  private unknownError(socket: Socket): void {
    this.server.to(socket.id).emit('socketError', { message: 'Unknown error' });
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket): Promise<void> {
    try {
      await this.userConnectionService.deleteBySocketId(socket.id);
    } catch {}
    socket.disconnect();
  }

  async handleConnection(@ConnectedSocket() socket: Socket): Promise<void> {
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

      await this.userConnectionService.create(user.id, {
        socketId: socket.id,
        type: 'CHAT',
      });
    } catch (e) {
      this.disconnect(socket);
    }
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: SendChatMessageDto,
  ): Promise<ChatMessageWithAuthor> {
    try {
      const msg = await this.chatService.createMessage(
        socket.data.user.id,
        dto.roomId,
        { content: dto.content },
      );

      this.server.to(dto.roomId).emit('newMessage', msg);

      return msg;
    } catch (e) {
      console.log(e);

      if (e instanceof UnauthorizedException) {
        this.server.to(socket.id).emit('socketError', { message: e.message });
      } else {
        this.unknownError(socket);
      }
    }
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomId: string,
  ): Promise<void> {
    if (
      !(await this.chatService.validateUserForRoom(socket.data.user.id, roomId))
    ) {
      this.server.emit('socketError', {
        message: "You can't join this chat room",
      });
      return;
    }
    socket.join(roomId);
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomId: string,
  ): void {
    socket.leave(roomId);
  }

  @SubscribeMessage('inviteUser')
  async addUserToChatRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: AddUserToChatRoomDto,
  ): Promise<void> {
    try {
      const userChatRoom = await this.chatService.addUserToRoom(
        dto.userId,
        dto.roomId,
      );

      this.server.to(userChatRoom.roomId).emit('newRoomUser', userChatRoom);
    } catch (e) {
      if (e instanceof BadRequestException) {
        this.server.to(socket.id).emit('socketError', { message: e.message });
      } else {
        this.unknownError(socket);
      }
    }
  }
}
