import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Response } from '../data/interfaces';
import { PongRoomService } from '../services/pong-room.service';
import { PongQueueService } from '../services/pong-queue.service';
import { AuthService } from '../../../auth/auth.service';
import { PongServerInterceptor } from '../pong-server.interceptor';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { UserService } from 'src/user/services/user.service';
import { PongInviteService } from '../services/pong-invite.service';
import { PongService } from 'src/pong/pong.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserConnectionService } from 'src/user/services/user-connection.service';

@Injectable({})
@UseInterceptors(new PongServerInterceptor())
@WebSocketGateway({ cors: 'true', namespace: '/pong' })
export class PongServerGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private logger: Logger = new Logger('PongServerGateway');
  private maxEntries = 200;

  @WebSocketServer()
  private server!: Server;

  constructor(
    @Inject(forwardRef(() => PongRoomService))
    private roomService: PongRoomService,
    @Inject(forwardRef(() => PongQueueService))
    private queueService: PongQueueService,
    @Inject(forwardRef(() => PongInviteService))
    private inviteService: PongInviteService,
    private pongService: PongService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly userConnectionService: UserConnectionService,
    private prisma: PrismaService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Server log: Socket is live');
    this.server.setMaxListeners(Infinity);

    // setInterval(() => {
    //   this.showServerInfo();
    // }, 30000);
  }

  to(room: string | string[]): any {
    return this.server.to(room);
  }

  /********** EVENT SUBSCRIPTIONS **********/
  /* TODO
   * Better management of await (with timeout and such).
   * Mark the socket as authorized.
   */
  async handleConnection(socket: Socket, ...args: any[]) {
    let data: Response = {
      code: 0,
      msg: 'you are now connected to the server.',
    };
    tryBlock: try {
      if (this.roomService.users.length >= this.maxEntries) {
        data = { code: 1, msg: 'server is full' };
      } else if (this.roomService.getUser(socket)) {
        data = { code: 1, msg: 'you are already connected' }; // TODO remove?
      } else {
        const payload = await this.authService.decodeToken(
          socket.handshake.headers.authorization,
        );
        const prismaUser = await this.userService.getUserById(payload.sub);
        if (!prismaUser) {
          data = { code: 1, msg: 'you are not registered' };
          break tryBlock;
        }

        await this.userConnectionService.create(prismaUser.id, {
          socketId: socket.id,
          type: 'GAME',
        });

        socket.data.user = prismaUser;
        socket.data.userRoom = <string>('u' + prismaUser.id);
        socket.data.gameRoom = 0;
        socket.join(socket.data.userRoom);
        this.roomService.addUser(socket);
        // this.userConnectionService.create(prismaUser.id, {

        // });
        socket.setMaxListeners(Infinity); // TODO
        this.logger.log(
          'Socket connection: socket connected with nickname ' +
            socket.data.user.displayName,
        );
      }

      // let i = 0;
      // while (i++ < 5) {
      //   this.roomService.createGameRoom(socket, socket);
      // }
    } catch (e) {
      data = { code: 1, msg: 'connection exception' };
    } finally {
      if (data.code === 0) {
        socket.emit('connect-success', data);
        socket.broadcast.emit('user-status-change', socket.data.user.id);
      } else {
        socket.emit('connect-error', data);
        this.disconnectSocket(socket);
      }
    }
  }

  handleDisconnect(socket: Socket) {
    this.disconnectSocket(socket);
  }

  @SubscribeMessage('join-queue')
  handleJoinQueue(@ConnectedSocket() socket: Socket): Response {
    const response = this.pongService.canQueue(socket?.data?.user?.id);
    if (response.code === 0) return this.queueService.userJoinQueue(socket);
    else return response;
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() id: string,
    @ConnectedSocket() socket: Socket,
  ): Response {
    return this.roomService.userJoinRoom(id, socket);
  }

  @SubscribeMessage('invite-player')
  handleInvitePlayer(
    @MessageBody() id: number,
    @ConnectedSocket() socket: Socket,
  ): Response {
    const response = this.pongService.canInvite(socket?.data?.user?.id);
    if (response.code != 0) return response;

    const targetSocket = this.roomService.getUserWithId(id);
    if (!targetSocket)
      return {
        code: 1,
        msg: 'You are trying to invite an offline or non-existant player',
      };
    if (targetSocket.data.user.id === socket.data.user.id)
      return { code: 1, msg: 'You can not invite yourself' };
    return this.inviteService.userInvite(socket, targetSocket);
  }

  /********** END EVENT SUBSCRIPTIONS **********/

  /* TODO
   * This is the "master disconnect".
   * It needs to make sure everything is ok before disconnecting.
   */
  private async disconnectSocket(socket: Socket) {
    try {
      await this.userConnectionService.deleteBySocketId(socket.id);
    } catch {}
    socket.disconnect;
    try {
      if (socket.data?.user?.id)
        socket.broadcast.emit('user-status-change', socket.data.user.id);
    } catch (e) {}
    this.logger.log('Socket disconnected');
  }

  showServerInfo() {
    this.logger.log('********************');
    this.logger.log('* PONG SERVER INFO *');
    this.logger.log('* Users: ' + this.roomService.getUserCount());
    this.logger.log('* Rooms: ' + this.roomService.getRoomCount());
    this.logger.log('* Queue: ' + this.queueService.getQueueSize());
    this.logger.log('********************');
  }

  getServer(): Server {
    return this.server;
  }
}
