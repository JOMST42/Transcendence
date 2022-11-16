import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameSettings, GameInfo } from 'src/pong/pong-game/data/interfaces';
import { PrismaService } from 'src/prisma/prisma.service';
import { PongRoom } from '../data/classes';
import { CreateGameDto, EndGameDto } from '../../../prisma/game/dto';
import { RoomState } from '../data/enums';
import { Response, RoomInfo } from '../data/interfaces';
import { PongServerGateway } from '../gateway/pong-server.gateway';
import { Game, User } from '@prisma/client';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserGameState } from 'src/pong/data/enums';

@Injectable({})
export class PongRoomService {
  logger: Logger = new Logger('PongRoomService');

  users: Socket[] = [];
  maxEntries = 200;

  rooms: PongRoom[] = [];
  max_rooms = 20;

  private disconnectListener: any;

  public classic_set: GameSettings = {
    score_to_win: 1,
    ball_radius: 10,
    pad_size: 50,
    pad_speed: 600,
    ball_speed: 5,
    ball_hit_multi: 1.05,
  };

  public test_set: GameSettings = {
    score_to_win: 100,
    ball_radius: 10,
    pad_size: 50,
    pad_speed: 600,
    ball_speed: 5,
    ball_hit_multi: 1.05,
  };

  constructor(
    @Inject(forwardRef(() => PongServerGateway))
    private server: PongServerGateway,
    private readonly prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {
    setInterval(() => {
      this.updateRooms();
    }, (1 / 60) * 1000);
  }

  private updateRooms() {
    let info: GameInfo | undefined;
    let room: PongRoom;
    this.cleanRooms();
    for (let i = 0; i < this.rooms.length; i++) {
      room = this.rooms[i];
      info = room.getGameUpdate();
      if (info) {
        this.server.to(room.getRoomId()).volatile.emit('game-update', info);
      }
      if (room.getState() === RoomState.Finished) {
        this.logger.debug('finish');
        this.endRoom(room);
      } // TODO
    }
  }

  cleanRooms() {
    let i: number;
    while (i < this.rooms.length) {
      if (this.rooms[i].isDeletable()) this.rooms.splice(i, 1);
      else i++;
    }
  }

  userJoinRoom(id: string, user: Socket): Response {
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].getRoomId() === id) {
        this.rooms[i].addUser(user);
        this.logger.log('user has joined room ' + id);
        user.join(this.rooms[i].getRoomId());
        user.emit('game-joined', 'game id ' + id + ' has been joined');
        return { code: 0, msg: 'user has joined room ' + id };
      }
    }
    return { code: 1, msg: 'room ' + id + ' does not exist' };
  }

  userLeaveRooms(user: Socket): Response {
    user.rooms.forEach((room) => user.leave(room));
    return { code: 0, msg: 'you have left all game rooms' };
  }

  userGetRooms(user: Socket): Response {
    const rooms: string[] = [];

    for (let i = 0; i < this.rooms.length; i++) {
      rooms.push(this.rooms[i].getRoomId());
    }
    return { code: 0, msg: 'rooms fetched', payload: rooms };
  }

  canCreateGameRoom(): boolean {
    if (this.rooms.length >= this.max_rooms) return false;
    return true;
  }

  // Returned payload: created PongRoom
  async createGameRoom(user1: Socket, user2: Socket): Promise<Response> {
    if (this.rooms.length >= this.max_rooms) {
      return { code: 1, msg: 'too many games currently being played' };
    }
    await this.prismaCreateGame(user1.data.user, user2.data.user)
      .then((game) => {
        const room: PongRoom = new PongRoom(
          game.id,
          'g' + game.id,
          user1,
          user2,
          game,
        );
        this.rooms.push(room);
        this.userJoinRoomAsPlayer(user1, room);
        this.userJoinRoomAsPlayer(user2, room);
        room.createGame(this.classic_set); // WARNING
        room.startWaiting(); // WARNING
        user1.emit('game-waiting', room.getRoomId());
        user2.emit('game-waiting', room.getRoomId());

        this.logger.log('Room created and joined by 2 players');
        return {
          code: 0,
          msg: 'Game created with 2 users from the queue',
          payload: room,
        };
      })
      .catch((game) => {
        this.logger.log('failed to add game to prisma... ' + game.id);
        return { code: 1, msg: 'Could not create game in the database' };
      });
  }

  async prismaCreateGame(p1: User, p2: User): Promise<Game> {
    const dto = new CreateGameDto();
    dto.player1Id = p1.id;
    dto.player2Id = p2.id;
    dto.description = 'Game successfully created';

    this.logger.log('Trying to add game to prisma... ');
    try {
      return await this.prisma.game.create({
        data: {
          player1Id: dto.player1Id,
          player2Id: dto.player2Id,
          description: dto.description,
        },
      });
    } catch (e) {
      this.logger.debug(e);
    }
    throw new BadRequestException('Could not create game');
  }

  async endRoom(room: PongRoom) {
    const roomInfo: RoomInfo = room.getRoomInfo();
    room.endRoom();

    this.logger.log('Trying to update game to prisma... ');
    try {
      return await this.prisma.game.update({
        where: {
          id: roomInfo.prismaId,
        },
        data: {
          scorePlayer1: roomInfo.score.p1,
          scorePlayer2: roomInfo.score.p2,
          description: 'Game is done',
          timePlayed: roomInfo.time,
          endTime: new Date(),
          winner: roomInfo.winner,
        },
      });
    } catch (e) {
      this.logger.debug(e);
    }
    throw new BadRequestException('Could not update game');
    // handle and process "OrderCreatedEvent" event
  }

  private userJoinRoomAsPlayer(user: Socket, room: PongRoom) {
    this.userLeaveRooms(user);
    this.userJoinRoom(room.getRoomId(), user);
  }

  addUser(user: Socket) {
    this.users.push(user);
    this.setDisconnectListener(user);
    this.setRoomListeners(user);
  }

  disconnectUser(user: Socket) {
    this.users.splice(this.users.indexOf(user), 1);
    this.clearListeners(user);
    //TODO remove from all room and matches
  }

  getUserCount(): number {
    return this.users.length;
  }

  getRoomCount(): number {
    return this.rooms.length;
  }

  getUserGameState(userId: number): UserGameState {
    const room = this.rooms.find((room) => {});
    return UserGameState.OFFLINE;
  }

  getUser(socket: Socket): Socket | undefined {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i] === socket) return this.users[i];
    }
    return undefined;
  }

  getUserWithId(userId: number): Socket | undefined {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].data?.user?.id === userId) return this.users[i];
    }
    return undefined;
  }

  getUserIndex(user: Socket): number {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i] === user) return i;
    }
    return -1;
  }

  getUserAndIndex(socket: Socket): [Socket, number] | undefined {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i] === socket) return [this.users[i], i];
    }
    return undefined;
  }

  /********** EVENT LISTENERS **********/
  setDisconnectListener(user: Socket) {
    this.disconnectListener = () => {
      this.disconnectUser(user);
    };

    user.on('disconnect', this.disconnectListener);
  }

  setRoomListeners(user: Socket) {
    user.on('leave-room', (id: string, callback) => {
      callback(this.userLeaveRooms(user));
    });
    user.on('get-rooms', (args, callback) => {
      callback(this.userGetRooms(user));
    });
  }

  clearRoomListeners(user: Socket) {
    user.removeAllListeners('get-rooms');
  }

  clearListeners(user: Socket) {
    user.off('disconnect', this.disconnectListener);
    this.clearRoomListeners(user);
  }
  /********** END EVENT LISTENERS **********/
}
