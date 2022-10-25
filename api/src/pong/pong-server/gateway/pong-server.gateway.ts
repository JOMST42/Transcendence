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
import { Response } from '../interfaces';
import { PongRoomService } from '../services/pong-room.service';
import { PongQueueService } from '../services/pong-queue.service';
import { AuthService } from '../../../auth/auth.service';
import { UserService } from '../../..//user/user.service';

@Injectable({})
@WebSocketGateway({ cors: 'true', namespace: '/pong' })
export class PongServerGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private logger: Logger = new Logger('PongServerGateway');
  private maxEntries = 200;
  private userId = 1; // TODO to be removed, test usage only

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
  async handleConnection(user: Socket, ...args: any[]) {
    let data = {
      event: 'connect-success',
      msg: 'you are now connected to the server.',
    };

    if (this.roomService.users.length >= this.maxEntries) {
      data = { event: 'connect-error', msg: 'server is full' };
    } else if (this.roomService.getUser(user)) {
      data = { event: 'connect-error', msg: 'you are already connected' };
    } else {
      try {
        const payload = await this.authService.decodeToken(
          user.handshake.headers.authorization,
        );
        const prismaUser = await this.userService.getUserById(payload.sub);

        if (!prismaUser) {
          this.disconnectUser(user);
          return;
        }

        user.data.user = prismaUser;
        // this.roomService.users.push(user);
        this.roomService.addUser(user);
        this.logger.log(
          'Socket connection: user connected with ip address ' +
            user.data.user.displayName +
            ' and added to users array. Current amount of users: ' +
            this.roomService.users.length,
        );
        user.emit(data.event, data.msg);
      } catch (e) {
        this.disconnectUser(user);
        return;
      }
    }
  }

  handleDisconnect(user: Socket) {
    this.disconnectUser(user);
    this.logger.log('Server log: user disconnected');
  }

  @SubscribeMessage('join-queue')
  handleJoinQueue(@ConnectedSocket() user: Socket): Response {
    // TODO check if already in a game
    return this.queueService.userJoinQueue(user);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() id: string,
    @ConnectedSocket() user: Socket,
  ): Response {
    return this.roomService.userJoinRoom(id, user);
  }

  // TODO remove
  @SubscribeMessage('update-pong')
  handleUpdatePong(@ConnectedSocket() user: Socket) {}

  /********** END EVENT SUBSCRIPTIONS **********/

  // TODO move it somewhere else or also warn queue and room service
  private disconnectUser(user: Socket) {
    user.disconnect;
    if (this.roomService.getUserAndIndex(user)) {
      this.roomService.users.splice(
        this.roomService.getUserAndIndex(user)![1],
        1,
      );
    } //TODO remove from all room and matches??
  }

  showServerInfo() {
    this.logger.log('***************');
    this.logger.log('* SERVER INFO *');
    this.logger.log('* Users: ' + this.roomService.getUserCount());
    this.logger.log('* Rooms: ' + this.roomService.getRoomCount());
    this.logger.log('* Queue: ' + this.queueService.getQueueSize());
    this.logger.log('***************');
  }
}
