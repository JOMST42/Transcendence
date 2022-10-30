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
import { ChatMessageWithAuthor, SendChatMessageDto } from '../dto/message.dto';
import { MessageService } from '../services/message.service';

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
    private readonly messageService: MessageService,
  ) {}

  private disconnect(socket: Socket): void {
    socket.emit('socketError', { message: 'Unauthorized' });
    socket.disconnect();
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket): Promise<void> {
    await this.userConnectionService.deleteBySocketId(socket.id);
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

      const rooms = await this.chatService.getRoomsForUser(user.id);

      for (const room of rooms) {
        socket.join(room.id);
      }
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
      const msg = await this.messageService.createMessage(
        socket.data.user.id,
        dto.roomId,
        { content: dto.content },
      );

      this.server.to(dto.roomId).emit('newMessage', msg);

      return msg;
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        this.server.to(socket.id).emit('socketError', { message: e.message });
      }
    }
  }
}
