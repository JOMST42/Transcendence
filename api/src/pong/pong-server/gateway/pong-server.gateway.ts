import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
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
import { UserService } from '../../..//user/user.service';
import { UserState } from 'src/pong/data/enums';

@Injectable({})
@WebSocketGateway({ cors: 'true', namespace: '/pong' })
export class PongServerGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private logger: Logger = new Logger('PongServerGateway');
  private maxEntries = 200;
  private userStates: Map<number, { value: UserState }> = new Map<
    number,
    { value: UserState }
  >();

  @WebSocketServer()
  private server!: Server;

  constructor(
    @Inject(forwardRef(() => PongRoomService))
    private roomService: PongRoomService,
    @Inject(forwardRef(() => PongQueueService))
    private queueService: PongQueueService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Server log: Socket is live');
    this.server.setMaxListeners(this.maxEntries); // WARNING need to read about it
    setInterval(() => {
      this.showServerInfo();
    }, 30000);
    // setInterval(() => {
    //   this.updateRooms();
    // }, (1 / 60) * 1000); // FPS
    // setInterval(() => {
    //   this.updateQueue();
    // }, 2000); // every 2 seconds
  }

  getServer(): Server {
    return this.server;
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
        data = { code: 1, msg: 'you are already connected' };
      } else {
        const payload = await this.authService.decodeToken(
          socket.handshake.headers.authorization,
        );
        const prismaUser = await this.userService.getUserById(payload.sub);
        socket.emit('connect-error', data);
        if (!prismaUser) {
          data = { code: 1, msg: 'you are not registered' };
          break tryBlock;
        }

        socket.data.user = prismaUser;
        // this.roomService.users.push(socket);
        this.roomService.addUser(socket);
        if (!this.userStates.has(prismaUser.id)) {
          this.userStates.set(prismaUser.id, { value: UserState.ONLINE });
        }
        socket.data.state = this.userStates.get(prismaUser.id);
        this.logger.log(
          'Socket connection: socket connected with nickname ' +
            socket.data.user.displayName,
        );
      }
    } catch (e) {
      data = { code: 1, msg: 'unknown connection exception' };
    } finally {
      if (data.code === 0) socket.emit('connect-success', data);
      else {
        socket.emit('connect-error', data);
        socket.disconnect();
      }
    }
  }

  handleDisconnect(socket: Socket) {
    this.disconnectSocket(socket);
    this.logger.log('Server log: socket disconnected');
  }

  @SubscribeMessage('join-queue')
  handleJoinQueue(@ConnectedSocket() socket: Socket): Response {
    return this.queueService.userJoinQueue(socket);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() id: string,
    @ConnectedSocket() socket: Socket,
  ): Response {
    return this.roomService.userJoinRoom(id, socket);
  }

  /********** END EVENT SUBSCRIPTIONS **********/

  /* TODO
   * This is the "master disconnect".
   * It needs to make sure everything is ok before disconnecting.
   */
  private disconnectSocket(socket: Socket) {
    socket.disconnect;
  }

  showServerInfo() {
    this.logger.log('********************');
    this.logger.log('* PONG SERVER INFO *');
    this.logger.log('* Users: ' + this.roomService.getUserCount());
    this.logger.log('* Rooms: ' + this.roomService.getRoomCount());
    this.logger.log('* Queue: ' + this.queueService.getQueueSize());
    this.logger.log('********************');
  }
}
