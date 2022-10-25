import { forwardRef, Inject, Injectable, Logger, Module } from '@nestjs/common';
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
import { GameInfo } from '../../pong-game/interfaces';
import { PongRoom, User, Queue } from '../classes';
import { RoomState } from '../enums';
import { Response } from '../interfaces';
import { PongRoomService } from '../services/pong-room.service';
import { PongQueueService } from '../services/pong-queue.service';

// @Module({
//   imports: [PongGameModule],
//   providers: [PongRoomService, PongQueueService],
// })
@Injectable({})
@WebSocketGateway({ cors: 'true', namespace: '/pong' })
export class PongServerGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private logger: Logger = new Logger('PongServerGateway');
  private max_users = 200;

  @WebSocketServer()
  private server!: Server;

  constructor(
    @Inject(forwardRef(() => PongRoomService))
    private roomService: PongRoomService,
    @Inject(forwardRef(() => PongQueueService))
    private queueService: PongQueueService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Server log: Socket is live');
    this.server.setMaxListeners(this.max_users); // WARNING need to read about it
    // setInterval(() => {
    //   this.showServerInfo();
    // }, 10000);
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
  handleConnection(client: Socket, ...args: any[]) {
    let data = {
      event: 'connect-success',
      msg: 'you are now connected to the server.',
    };

    if (this.roomService.users.length >= this.max_users) {
      data = { event: 'connect-error', msg: 'server is full' };
    } else if (this.roomService.getUser(client)) {
      data = { event: 'connect-error', msg: 'you are already connected' };
    } else {
      const user: User = new User(client);
      // this.roomService.users.push(user);
      this.roomService.addUser(user);
      this.logger.log(
        'Socket connecton: client connected with ip address ' +
          client.handshake.address +
          ' and added to users array. Current amount of users: ' +
          this.roomService.users.length,
      );
    }
    client.emit(data.event, data.msg);
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
    if (!user) return;
    return this.roomService.userJoinRoom(id, user);
  }

  // TODO remove
  @SubscribeMessage('update-pong')
  handleUpdatePong(@ConnectedSocket() client: Socket) {}

  /********** END EVENT SUBSCRIPTIONS **********/

  showServerInfo() {
    this.logger.log('***************');
    this.logger.log('* SERVER INFO *');
    this.logger.log('* Users: ' + this.roomService.getUserCount());
    this.logger.log('* Rooms: ' + this.roomService.getRoomCount());
    this.logger.log('* Queue: ' + this.queueService.getQueueSize());
    this.logger.log('***************');
  }

  // TODO move it somewhere else or also warn queue and room service
  private disconnectUser(client: User | Socket) {
    let socket: Socket | undefined;
    if (client instanceof Socket) {
      socket = client;
    } else {
      socket = client.getSocket();
    }
    if (socket) {
      socket.disconnect;
      this.roomService.users.splice(
        this.roomService.getUserAndIndex(socket)![1],
        1,
      );
    } //TODO remove from all room and matches??
  }
}
