import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Timer } from '../../../data/classes';
import { Player } from '.';
import { GameInfo, GameSettings } from '../../../pong-game/data/interfaces';
import { PongGameModule } from '../../../pong-game/pong-game.module';
import { RoomState, VictoryType } from '../enums';
import { Response } from '../../data/interfaces';
import { Countdown } from '../interfaces/pong-server.Countdown';
import { Victory } from '../interfaces/pong-server.Victory';
import { TimerType } from '../../../data/enums';

export class PongRoom {
  private logger: Logger = new Logger('PongServerModule');

  private roomId: string;
  private state: RoomState = RoomState.Waiting;
  private userP1?: Socket | undefined;
  private userP2?: Socket | undefined;
  private p1!: Player;
  private p2!: Player;
  private users: Socket[] = [];
  private game!: PongGameModule;

  private readyCountdown: Timer;
  private gameCountdown: Timer;
  private gameTimer: Timer;

  private disconnectListener: any;

  constructor(
    id: string,
    userP1: Socket | undefined,
    userP2: Socket | undefined,
  ) {
    this.roomId = id;
    this.setUserPlayer(1, userP1);
    this.setUserPlayer(2, userP2);
    this.p1 = new Player();
    this.p2 = new Player();

    this.readyCountdown = new Timer(TimerType.COUNTDOWN, 10, 0);
    this.gameCountdown = new Timer(TimerType.COUNTDOWN, 3, 0);
    this.gameTimer = new Timer(TimerType.STOPWATCH, 0, 0);
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
    this.setGame(new PongGameModule(set));
    return this.getGame();
  }

  startGame(ai_1?: boolean, ai_2?: boolean) {
    this.getGame()?.startGame(ai_1, ai_2);
    this.state = RoomState.Playing;
  }

  pauseGame() {
    this.getGame()?.pause();
  }

  resumeGame() {
    this.getGame()?.resume();
  }

  getGameUpdate(): GameInfo | undefined {
    if (this.game.isFinished()) this.state = RoomState.Finished; // WARNING
    return this.getGame()?.getGameInfo();
  }

  handleMove(direction: string, player: number, moveType: string) {
    if (player === 1 || player === 2) {
      if (moveType === 'start') this.getGame()?.movePad(player, direction);
      if (moveType === 'stop') this.getGame()?.stopPad(player, direction);
    }
  }

  startReadying() {
    this.state = RoomState.Readying;
    this.readyCountdown.reset();
    this.readyCountdown.start(() => {
      return this.startCountdown();
    });
    this.logger.log('Room readying for...' + this.readyCountdown.timer);
  }

  startCountdown() {
    this.state = RoomState.Countdown;
    this.gameCountdown.reset();
    this.gameCountdown.start(() => {
      return this.startGame(false, false);
    });
    this.logger.log('Game starting in...' + this.gameCountdown.timer);
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
    if (i === 1 || i === 2) {
      if (i === 1) this.p1.ready = flag;
      else this.p2.ready = flag;
      response = { code: 0, msg: 'player ' + i + ' is now ready!' };
    } else {
      response = { code: 1, msg: 'player ' + i + ' could not be readied.' };
    }
    if (this.p1.ready && this.p2.ready && this.state === RoomState.Readying) {
      this.readyCountdown.stop(true);
    }
    return response;
  }

  isPlayerReady(i: number): boolean {
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
    this.setReadyListeners(user);
    this.setInputListeners(user);
  }

  getRoomId(): string {
    return this.roomId;
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
  private setDisconnectListener(user: Socket) {
    user.on('disconnect', () => {});
  }

  private setReadyListeners(user: Socket) {
    const playerIndex = this.isUserPlayer(user);
    if (playerIndex === 1 || playerIndex === 2) {
      user.on('ready-to-play', (args, callback) => {
        const response = this.setReadyPlayer(playerIndex, true);
        callback(response);
        if (response.code === 0) {
          user
            .to(this.roomId)
            .emit('player-ready', 'player ' + playerIndex + ' is ready!');
        }
      });
      user.on('unready-to-play', (args, callback) => {
        callback(this.setReadyPlayer(playerIndex, false));
      });
    }
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

  private clearReadyListeners(user: Socket) {
    user.removeAllListeners('ready-to-play');
  }

  private clearInputListeners(user: Socket) {
    user.removeAllListeners('move-start');
    user.removeAllListeners('move-end');
  }

  private clearListeners(user: Socket) {
    user.off('disconnect', this.disconnectListener);
    this.clearReadyListeners(user);
    this.clearInputListeners(user);
  }
}
