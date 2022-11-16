import { Inject, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Timer } from '../../../data/classes';
import { Player } from '.';
import { GameInfo, GameSettings } from '../../../pong-game/data/interfaces';
import { PongGameModule } from '../../../pong-game/pong-game.module';
import { RoomState, VictoryType } from '../enums';
import { Response, RoomInfo } from '../../data/interfaces';
import { Victory } from '../interfaces/pong-server.Victory';
import { UserGameState, TimerType } from '../../../data/enums';
import { Game, Winner } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

export class PongRoom {
  private logger: Logger = new Logger('PongRoomClass');

  private prismaId: number;
  private roomId: string;
  private state: RoomState = RoomState.Waiting;
  private userP1?: Socket | undefined;
  private userP2?: Socket | undefined;
  private p1!: Player;
  private p2!: Player;
  private users: Socket[] = [];
  private game!: PongGameModule;
  private prismaGame!: Game;

  private readyCountdown: Timer;
  private gameCountdown: Timer;
  private waitCountdown: Timer;

  private settings: GameSettings;

  constructor(
    prismaId: number,
    roomId: string,
    userP1: Socket | undefined,
    userP2: Socket | undefined,
    prismaGame: Game,
  ) {
    this.prismaId = prismaId;
    this.roomId = roomId;
    this.setUserPlayer(1, userP1);
    this.setUserPlayer(2, userP2);
    this.p1 = new Player(userP1?.data.user.id);
    this.p2 = new Player(userP2?.data.user.id);
    this.prismaGame = prismaGame;

    this.waitCountdown = new Timer(TimerType.COUNTDOWN, 60, 0);
    this.readyCountdown = new Timer(TimerType.COUNTDOWN, 20, 0);
    this.gameCountdown = new Timer(TimerType.COUNTDOWN, 3, 0);
  }

  async endRoom() {
    this.logger.debug('ending room ' + this.roomId);
    this.state = RoomState.Processing;
    this.users.forEach((user: Socket) => this.clearListeners(user));
    this.state = RoomState.ToBeDeleted;
  }

  isDeletable(): boolean {
    if (this.state === RoomState.ToBeDeleted) return true;
    return false;
  }

  addUser(user: Socket): boolean {
    if (this.findUser(user)) return false;
    this.users.push(user);
    return true;
  }

  // Returns an Socket if found; undefined if not found
  findUser(user: Socket): Socket | undefined {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i] === user) {
        return this.users[i];
      }
    }
    return undefined;
  }

  createGame(set: GameSettings): PongGameModule {
    this.settings = set;
    this.setGame(new PongGameModule(set));
    return this.getGame();
  }

  startGame(ai_1?: boolean, ai_2?: boolean) {
    this.logger.debug('game playing');
    this.prismaGame.startTime = new Date();
    this.getGame()?.startGame(ai_1, ai_2);
    this.getUserPlayer1().emit('game-start');
    this.getUserPlayer2().emit('game-start');
    this.state = RoomState.Playing;
  }

  pauseGame() {
    this.getGame()?.pause();
  }

  resumeGame() {
    this.getGame()?.resume();
  }

  getGameUpdate(): GameInfo | undefined {
    if (this.game.isFinished() && this.state === RoomState.Playing) {
      this.state = RoomState.Finished;
    } // TODO
    return this.getGame()?.getGameInfo();
  }

  handleMove(direction: string, player: number, moveType: string) {
    if (player === 1 || player === 2) {
      if (moveType === 'start') this.getGame()?.movePad(player, direction);
      if (moveType === 'stop') this.getGame()?.stopPad(player, direction);
    }
  }

  startWaiting() {
    this.state = RoomState.Waiting;
    this.waitCountdown.reset();
    this.waitCountdown.start(() => {
      return this.startReadying();
    });
    this.logger.log('Room waiting for...' + this.waitCountdown.getTime());
  }

  startReadying() {
    this.state = RoomState.Readying;
    this.readyCountdown.reset();
    this.readyCountdown.start(() => {
      return this.startCountdown();
    });
    this.logger.log('Room readying for...' + this.readyCountdown.getTime());
  }

  startCountdown() {
    this.state = RoomState.Countdown;
    this.gameCountdown.reset();
    this.gameCountdown.start(() => {
      return this.startGame(false, false);
    });
    this.logger.log('Game starting in...' + this.gameCountdown.getTime());
  }

  getVictoryInfo(): Victory | undefined {
    let victory: Victory | undefined = undefined;
    if (this.game.isVictory()) {
      victory = {
        winner: this.game.getWinner(),
        score: this.game.getScore(),
        type: VictoryType.WIN,
      };
    }
    return victory;
  }

  setReadyPlayer(i: number, flag: boolean): Response {
    let response: Response;
    if (this.state !== RoomState.Readying) {
      return { code: 1, msg: 'Room is not in a ready check' };
    }
    if (i === 1 || i === 2) {
      if (i === 1) this.p1.ready = flag;
      else this.p2.ready = flag;
      if (flag === true)
        response = { code: 0, msg: 'player ' + i + ' is now ready!' };
      else response = { code: 0, msg: 'player ' + i + ' has unreadied!' };
    } else {
      response = { code: 1, msg: 'player ' + i + ' is not a player.' };
    }
    if (this.p1.ready && this.p2.ready && this.state === RoomState.Readying) {
      this.readyCountdown.stop(true);
    }
    return response;
  }

  setJoinStatus(i: number, flag: boolean): Response {
    let response: Response;
    if (this.state !== RoomState.Waiting) {
      return { code: 1, msg: 'Room is not waiting for players' };
    }
    if (i === 1 || i === 2) {
      if (i === 1) this.p1.joined = flag;
      else this.p2.joined = flag;
      if (flag === true)
        response = { code: 0, msg: 'player ' + i + ' has joined the game!' };
      else response = { code: 0, msg: 'player ' + i + ' has left the game!' };
    } else {
      response = { code: 1, msg: 'player ' + i + ' is not a player.' };
    }
    if (this.p1.joined && this.p2.joined && this.state === RoomState.Waiting) {
      this.waitCountdown.stop(true);
    }
    return response;
  }

  isPlayerRoom(i: number): boolean {
    if (i === 1) return this.p1.ready;
    if (i === 2) return this.p2.ready;
    return false;
  }

  // return 0 if user is not a player. Else it returns 1 or 2 depending on which player they are.
  isUserPlayer(user: Socket | undefined): number {
    if (user === this.userP1) return 1;
    if (user === this.userP2) return 2;
    return 0;
  }

  setGame(game: PongGameModule) {
    this.game = game;
  }

  setUserPlayer(i: 1 | 2, user: Socket | undefined) {
    if (i === 1) this.userP1 = user;
    if (i === 2) this.userP2 = user;
    this.setGameListeners(user);
    this.setRoomListeners(user);
    this.setInputListeners(user);
  }

  getRoomInfo(): RoomInfo {
    let info: RoomInfo;
    info = {
      prismaId: this.prismaId,
      roomId: this.roomId,
      user1: this.getUserPlayer1().data.user,
      user2: this.getUserPlayer2().data.user,
      score: this.getGame().getScore(),
      scoreToWin: this.settings.score_to_win,
      state: this.getState(),
      time: this.getGame()?.getGameTime(),
      winner: this.getWinner(),
    };
    return info;
  }

  getWinner(): Winner {
    if (this.getGame().getWinner() === 1) return Winner.PLAYER1;
    if (this.getGame().getWinner() === 2) return Winner.PLAYER2;
    return Winner.NONE;
  }

  getRoomId(): string {
    return this.roomId;
  }

  getUserGameState(userId: number): UserGameState {
    let player: Player;

    if (userId === this.p1?.userId) player = this.p1;
    else if (userId === this.p2?.userId) player = this.p2;
    else return UserGameState.OFFLINE;

    switch (this.state) {
      case RoomState.Countdown:
      case RoomState.Playing:
        return UserGameState.PLAYING;
        break;
      case RoomState.Waiting:
        if (!player.joined) return UserGameState.RECONNECT;
        else return UserGameState.WAITING;
      default:
        return UserGameState.OFFLINE;
    }
  }

  getPrismaGame(): Game {
    return this.prismaGame;
  }

  getState(): RoomState {
    return this.state;
  }

  getGame(): PongGameModule {
    return this.game;
  }

  getUserPlayer1(): Socket | undefined {
    return this.userP1;
  }

  getUserPlayer2(): Socket | undefined {
    return this.userP2;
  }

  getUsers(): Socket[] {
    return this.users;
  }

  /********** EVENT LISTENERS **********/
  private setGameListeners(user: Socket) {
    const playerIndex = this.isUserPlayer(user);
    if (playerIndex === 1 || playerIndex === 2) {
      user.on('join-game', (args, callback) => {
        const response = this.setJoinStatus(playerIndex, true);
        callback(response);
        if (response.code === 0) {
          user
            .to(this.roomId)
            .emit(
              'player-joined',
              'player ' + playerIndex + ' has joined the game!',
            );
        }
      });
      user.on('leave-game', (args, callback) => {
        const response = this.setJoinStatus(playerIndex, false);
        callback(response);
        if (response.code === 0) {
          user
            .to(this.roomId)
            .emit(
              'player-left',
              'player ' + playerIndex + ' has left the game!',
            );
        }
      });
    }
  }

  private setRoomListeners(user: Socket) {
    const playerIndex = this.isUserPlayer(user);
    if (playerIndex === 1 || playerIndex === 2) {
      user.on('ready-to-play', (args, callback) => {
        const response = this.setReadyPlayer(playerIndex, true);
        callback(response);
        if (response.code === 0) {
          user
            .to(this.roomId)
            .emit('player-ready', user.data.user.displayName + ' is ready!');
        }
      });
      user.on('unready-to-play', (args, callback) => {
        const response = this.setReadyPlayer(playerIndex, false);
        callback(response);
        if (response.code === 0) {
          user
            .to(this.roomId)
            .emit('player-unready', user.data.user.displayName + ' unreadied!');
        }
      });
    }

    user.on('get-room-info', (args, callback) => {
      const response: Response = { code: 0, msg: 'Room informations' };
      response.payload = this.getRoomInfo();
      callback(response);
    });
  }

  private setInputListeners(user: Socket) {
    const playerIndex = this.isUserPlayer(user);
    if (playerIndex === 1 || playerIndex === 2) {
      user.on('move-start', (direction: string) => {
        this.handleMove(direction, playerIndex, 'start');
      });
      user.on('move-end', (direction: string) => {
        this.handleMove(direction, playerIndex, 'stop');
      });
    }
  }

  private clearGameListeners(user: Socket) {
    user.removeAllListeners('join-game');
    user.removeAllListeners('leave-game');
  }

  private clearRoomListeners(user: Socket) {
    user.removeAllListeners('ready-to-play');
    user.removeAllListeners('unready-to-play');
  }

  private clearInputListeners(user: Socket) {
    user.removeAllListeners('move-start');
    user.removeAllListeners('move-end');
  }

  private clearListeners(user: Socket) {
    this.clearGameListeners(user);
    this.clearRoomListeners(user);
    this.clearInputListeners(user);
  }
}
