import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PongGameModule } from '../../pong-game/pong-game.module';
import { GameInfo, GameSettings } from '../../pong-game/interfaces';
import { PongRoom, User, Queue } from '../classes';
import { RoomState } from '../enums';
import { Response } from '../interfaces';
import { PongServerGateway } from '../gateway/pong-server.gateway';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateGameDto } from '../dto';

@Injectable({})
export class PongRoomService {
  logger: Logger = new Logger('PongRoomService');

  users: User[] = [];
  maxEntries = 200;

  next_room_id = '0';
  rooms: PongRoom[] = [];
  max_rooms = 20;
  room_count = 0;

  // queue: Queue = new Queue();

  public classic_set: GameSettings = {
    score_to_win: 7,
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
  ) {
    setInterval(() => {
      this.updateRooms();
    }, (1 / 60) * 1000);
  }

  private updateRooms() {
    let info: GameInfo | undefined;
    let room: PongRoom;
    for (let i = 0; i < this.rooms.length; i++) {
      room = this.rooms[i];
      info = room.getGameUpdate();
      if (info) {
        this.server.to(room.getRoomId()).volatile.emit('game-update', info);
      }
      if (room.getState() === RoomState.Finished) {
      } // TODO
    }
  }

  userReadyToPlay(user: User): Response {
    let room: PongRoom;
    let p_index: number;

    for (let i = 0; i < this.rooms.length; i++) {
      room = this.rooms[i];
      p_index = room.isUserPlayer(user);
      if (p_index === 1 || p_index === 2) {
        room.setReadyPlayer(p_index, true);
        return { code: 0, msg: 'You are now considered ready' };
      }
    }
    return { code: 1, msg: 'could not ready you' };
  }

  userJoinRoom(id: string, user: User): Response {
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].getRoomId() === id) {
        this.rooms[i].addUser(user);
        this.logger.log('user has joined room ' + id);
        user.getSocket().join(this.rooms[i].getRoomId());
        user
          .getSocket()
          .emit('game-joined', 'game id ' + id + ' has been joined');
        return { code: 0, msg: 'user has joined room ' + id };
      }
    }
    return { code: 1, msg: 'room ' + id + ' does not exist' };
  }

  userLeaveRooms(user: User): Response {
    user.getSocket().rooms.forEach((room) => user.getSocket().leave(room));
    return { code: 0, msg: 'you have left all game rooms' };
  }

  userGetRooms(user: User): Response {
    const rooms: string[] = [];

    for (let i = 0; i < this.rooms.length; i++) {
      rooms.push(this.rooms[i].getRoomId());
    }
    return { code: 0, msg: 'rooms fetched', payload: rooms };
  }

  handleMove(direction: string, user: User, moveType: string) {
    let room: PongRoom | undefined;
    let plyr_i = 0;
    for (let i = 0; i < this.rooms.length; i++) {
      room = this.rooms[i];
      plyr_i = room.isUserPlayer(user);
      if (plyr_i === 1 || plyr_i === 2) {
        const pongGame: PongGameModule | undefined = room.getGame();
        if (!pongGame) return;
        if (moveType === 'start') pongGame.movePad(plyr_i, direction);
        if (moveType === 'stop') pongGame.stopPad(plyr_i, direction);
        break;
      }
    }
  }

  getRoomUpdate(room?: PongRoom): GameInfo | undefined {
    let info: GameInfo | undefined;
    info = room?.getGameUpdate();
    if (info) return info;
    return undefined;
    // if (room.getState() === RoomState.Finished) {
    //   this.logger.log(room.getVictoryInfo()?.winner);
    // }
  }

  canCreateGameRoom(): boolean {
    if (this.rooms.length >= this.max_rooms) return false;
    return true;
  }

  // Returned payload: created PongRoom
  createGameRoom(user1: User, user2: User): Response {
    if (this.rooms.length >= this.max_rooms) {
      return { code: 1, msg: 'too many games currently being played' };
    }
    const room: PongRoom = new PongRoom(this.next_room_id, user1, user2);
    this.rooms.push(room);
    this.userJoinRoomAsPlayer(user1, room);
    this.userJoinRoomAsPlayer(user2, room);
    room.createGame(this.classic_set); // WARNING
    this.prismaCreateGame(room);
    room.startReadying(); // WARNING
    this.room_count++;
    this.next_room_id = this.room_count.toString();
    this.logger.log('Room created and joined by 2 players');
    return {
      code: 0,
      msg: 'Game created with 2 users from the queue',
      payload: room,
    };
  }

  async prismaCreateGame(room: PongRoom): Promise<boolean> {
    const dto = new CreateGameDto();
    dto.player1Id = room.getUserPlayer1().getId();
    dto.player2Id = 2;
    // dto.player2Id = room.getUserPlayer1().getId();
    dto.description = 'Game successfully created';
    this.logger.log('Trying to add game to prisma... ');
    try {
      await this.prisma.game.create({
        data: {
          player1Id: dto.player1Id,
          player2Id: dto.player2Id,
          description: dto.description,
        },
      });
    } catch (e) {
      this.logger.debug(e);
    }
    return true;
  }

  private userJoinRoomAsPlayer(user: User, room: PongRoom) {
    this.userLeaveRooms(user);
    this.userJoinRoom(room.getRoomId(), user);
    this.setInputListeners(user);
    this.setGameListeners(user);
  }

  addUser(user: User) {
    this.users.push(user);
    this.setRoomListeners(user);
  }

  disconnectUser(client: User | Socket) {
    let socket: Socket | undefined;
    if (client instanceof Socket) {
      socket = client;
    } else {
      socket = client.getSocket();
    }
    if (socket) {
      socket.disconnect;
      this.users.splice(this.getUserAndIndex(socket)![1], 1);
    } //TODO remove from all room and matches
  }

  getUserCount(): number {
    return this.users.length;
  }

  getRoomCount(): number {
    return this.rooms.length;
  }

  getUser(socket: Socket): User | undefined {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].getSocket() === socket) return this.users[i];
    }
    return undefined;
  }

  getUserIndex(user: User): number {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i] === user) return i;
    }
    return -1;
  }

  getUserAndIndex(socket: Socket): [User, number] | undefined {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].getSocket() === socket) return [this.users[i], i];
    }
    return undefined;
  }

  /********** EVENT LISTENERS **********/
  setGameListeners(user: User) {
    user.socket?.on('ready-to-play', (args, callback) => {
      callback(this.userReadyToPlay(user));
    });
  }

  setInputListeners(user: User) {
    user.socket?.on('move-start', (direction: string, callback) => {
      callback(this.handleMove(direction, user, 'start'));
    });

    user.socket?.on('move-end', (direction: string, callback) => {
      callback(this.handleMove(direction, user, 'stop'));
    });
  }

  setRoomListeners(user: User) {
    user.socket?.on('leave-room', (id: string, callback) => {
      callback(this.userLeaveRooms(user));
    });
    user.socket?.on('get-rooms', (args, callback) => {
      callback(this.userGetRooms(user));
    });
  }

  clearGameListeners(user: User) {
    user.socket.removeAllListeners('ready-to-play');
  }

  clearInputListeners(user: User) {
    user.socket.removeAllListeners('move-start');
    user.socket.removeAllListeners('move-end');
    user.socket.removeAllListeners('get-rooms');
  }

  clearRoomListeners(user: User) {
    user.socket.removeAllListeners('get-rooms');
  }

  clearListeners(user: User) {
    this.clearGameListeners(user);
    this.clearInputListeners(user);
    this.clearRoomListeners(user);
  }
  /********** END EVENT LISTENERS **********/
}
