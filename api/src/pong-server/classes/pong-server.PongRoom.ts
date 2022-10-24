import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Player, User } from '.';
import { GameInfo, GameSettings } from '../../pong-game/interfaces';
import { PongGameModule } from '../../pong-game/pong-game.module';
import { RoomState, VictoryType } from '../enums';
import { Victory } from '../interfaces/pong-server.Victory';

export class PongRoom {
  private logger: Logger = new Logger('PongServerModule');

  private roomId: string;
  private state: RoomState = RoomState.Waiting;
  private userP1?: User | undefined;
  private userP2?: User | undefined;
  private p1!: Player;
  private p2!: Player;
  private users: User[] = [];
  private game!: PongGameModule;

  private countdownId: NodeJS.Timer;
  private countdown = 0;
  private countdownTime = 3;

  private readyingId: NodeJS.Timer;
  private readyingTimer = 0;
  private readyingTime = 10;

  constructor(id: string, userP1: User | undefined, userP2: User | undefined) {
    this.roomId = id;
    this.setUserPlayer1(userP1);
    this.setUserPlayer2(userP2);
    this.p1 = new Player();
    this.p2 = new Player();
  }

  addUser(user: User): boolean {
    if (this.findUser(user)) return false;
    this.users.push(user);
    return true;
  }

  // Returns an User if found; undefined if not found
  findUser(client: User | Socket): User | undefined {
    for (let i = 0; i < this.users.length; i++) {
      if (client instanceof User && this.users[i] === client)
        return this.users[i];
      else if (client instanceof Socket && this.users[i].getSocket() === client)
        return this.users[i];
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

  startReadying() {
    this.state = RoomState.Readying;
    this.resetReadying();
    this.logger.log('Room readying...' + this.readyingTimer);
    this.countdownId = setInterval(() => this.tickReadying(), 1000);
  }

  tickReadying() {
    if (this.readyingTimer > 0) this.readyingTimer--;
    if (this.readyingTimer === 0) {
      this.startCountdown();
      clearInterval(this.readyingId);
    }
    this.logger.log(this.readyingTimer);
  }

  resetReadying() {
    clearInterval(this.readyingId);
    this.readyingTimer = this.readyingTime;
  }

  startCountdown() {
    this.state = RoomState.Countdown;
    this.resetCountdown();
    this.logger.log('Room countdown...' + this.countdown);
    this.countdownId = setInterval(() => this.tickCountdown(), 1000);
  }

  tickCountdown() {
    if (this.countdown > 0) this.countdown--;
    if (this.countdown === 0) {
      this.state = RoomState.Playing;
      if (this.game.isStarted()) this.game.resume();
      else this.startGame(false, false);
      this.resetCountdown();
    }
    this.logger.log(this.countdown);
  }

  resetCountdown() {
    clearInterval(this.countdownId);
    this.countdown = this.countdownTime;
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

  setReadyPlayer(i: number, flag: boolean) {
    if (i === 1) this.p1.ready = flag;
    if (i === 2) this.p2.ready = flag;
    if (this.p1.ready && this.p2.ready && this.state === RoomState.Readying) {
      this.resetReadying();
      this.startCountdown();
    }
  }

  isPlayerReady(i: number): boolean {
    if (i === 1) return this.p1.ready;
    if (i === 2) return this.p2.ready;
    return false;
  }

  // return 0 if user is not a player. Else it returns 1 or 2 depending on which player they are.
  isUserPlayer(user: User | undefined): number {
    if (user === this.userP1) return 1;
    if (user === this.userP2) return 2;
    return 0;
  }

  setGame(game: PongGameModule) {
    this.game = game;
  }

  setUserPlayer1(user: User | undefined) {
    this.userP1 = user;
  }

  setUserPlayer2(user: User | undefined) {
    this.userP2 = user;
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

  getUserPlayer1(): User | undefined {
    return this.userP1;
  }

  getUserPlayer2(): User | undefined {
    return this.userP2;
  }

  getUsers(): User[] {
    return this.users;
  }
}
