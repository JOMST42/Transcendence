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
import { User } from '../classes';
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
  async handleConnection(client: Socket, ...args: any[]) {
    let data = {
      event: 'connect-success',
      msg: 'you are now connected to the server.',
    };

    if (this.roomService.users.length >= this.maxEntries) {
      data = { event: 'connect-error', msg: 'server is full' };
    } else if (this.roomService.getUser(client)) {
      data = { event: 'connect-error', msg: 'you are already connected' };
    } else {
      try {
        const payload = await this.authService.decodeToken(
          client.handshake.headers.authorization,
        );
        const user = await this.userService.getUserById(payload.sub);

        if (!user) {
          this.disconnectUser(client);
          return;
        }

        // client.data.user = user;
        const pongUser: User = new User(user.id, client);
        // this.roomService.users.push(user);
        this.roomService.addUser(pongUser);
        this.logger.log(
          'Socket connection: client connected with ip address ' +
            user.displayName +
            ' and added to users array. Current amount of users: ' +
            this.roomService.users.length,
        );
        client.emit(data.event, data.msg);
      } catch (e) {
        this.disconnectUser(client);
        return;
      }
    }
  }

  handleDisconnect(client: Socket) {
    this.disconnectUser(client);
    this.logger.log('Server log: client disconnected');
  }

  @SubscribeMessage('join-queue')
  handleJoinQueue(@ConnectedSocket() client: Socket): Response {
    const user: User | undefined = this.roomService.getUser(client);
    if (!user) return { code: 2, msg: 'you are not registered' };
    // TODO check if already in a game
    return this.queueService.userJoinQueue(user);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() id: string,
    @ConnectedSocket() client: Socket,
  ): Response {
    const user: User | undefined = this.roomService.getUser(client);
    if (!user) return { code: 2, msg: 'you are not registered' };
    return this.roomService.userJoinRoom(id, user);
  }

  // TODO remove
  @SubscribeMessage('update-pong')
  handleUpdatePong(@ConnectedSocket() client: Socket) {}

  /********** END EVENT SUBSCRIPTIONS **********/

  // TODO move it somewhere else or also warn queue and room service
  private disconnectUser(client: User | Socket) {
    let socket: Socket | undefined;
    if (client instanceof User) {
      socket = client.getSocket();
    } else {
      socket = client;
    }
    if (socket) {
      socket.disconnect;
      if (this.roomService.getUserAndIndex(socket)) {
        this.roomService.users.splice(
          this.roomService.getUserAndIndex(socket)![1],
          1,
        );
      }
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
