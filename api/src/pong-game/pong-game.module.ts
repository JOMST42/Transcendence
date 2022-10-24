import { Logger } from '@nestjs/common';
import {
  GameInfo,
  GameSettings,
  Vector3,
  Collision,
  Event,
  Score,
} from './interfaces';
import { EventType } from './enums';
import { Pad, Ball } from './classes';

export class PongGameModule {
  private logger: Logger = new Logger('PongGameModule');
  private pad1!: Pad;
  private pad2!: Pad;
  private ball: Ball;
  private dimension: Vector3 = { x: 600, y: 400 };
  private center: Vector3 = { x: 300, y: 200 };
  private score: number[] = [0, 0];
  private score_to_win: number;
  private winner = 0;
  private events: Event[] = [];

  private started = false;
  private paused = false;
  private victory = false;
  private finished = false;

  constructor(set: GameSettings) {
    this.setPad1(
      new Pad(1, { x: 10, y: 150 }, { x: 5, y: set?.pad_size }, set?.pad_speed),
    );
    this.setPad2(
      new Pad(
        2,
        { x: 580, y: 150 },
        { x: 5, y: set?.pad_size },
        set?.pad_speed,
      ),
    );
    this.ball = new Ball(
      { x: this.dimension.x / 2, y: this.dimension.y / 2 },
      set?.ball_radius,
      set?.ball_speed,
      set?.ball_hit_multi,
    );
    this.score_to_win = set?.score_to_win;
  }

  startGame(ai_1?: boolean, ai_2?: boolean) {
    if (ai_1) this.getPad1().setAI(true);
    if (ai_2) this.getPad2().setAI(true);
    this.started = true;
    setInterval(() => {
      this.runGame();
    }, (1 / 60) * 1000); // FPS
  }

  runGame() {
    if (!this.started || this.paused || this.finished) return;
    this.updateBall();
    this.updatePads();
  }

  // update(): {};

  getGameInfo(): GameInfo {
    let pong_info: GameInfo;
    pong_info = {
      b_pos: this.ball.getPos(),
      p1_pos: this.getPad1().getPos(),
      p2_pos: this.getPad2().getPos(),
      b_rad: this.ball.getRadius(),
      p1_size: this.getPad1().getSize(),
      p2_size: this.getPad2().getSize(),
      events: this.events,
    };
    this.events = [];
    return pong_info;
  }

  movePad(i: number, dir: string) {
    if (!this.started) return;
    if (dir == 'up') this.getPad(i)?.setMovingUp(true);
    else if (dir == 'down') this.getPad(i)?.setMovingDown(true);
  }

  stopPad(i: number, dir: string) {
    if (!this.started) return;
    if (dir === 'up') this.getPad(i)?.setMovingUp(false);
    else if (dir === 'down') this.getPad(i)?.setMovingDown(false);
  }

  updateBall() {
    const b: Ball = this.ball;
    const new_pos: Vector3 = { x: 0, y: 0 };
    let col: Collision | undefined;

    new_pos.x = b.getPos().x + b.getVel().x;
    new_pos.y = b.getPos().y + b.getVel().y;
    col = b.checkPadCollision(this.getPad1());
    if (!col) {
      col = b.checkPadCollision(this.getPad2());
    }
    if (col) {
      this.addCollisionEvent(col.pos, 'Pad');
    } else {
      const player: number = this.checkScoreCollision(new_pos, b.getSize());
      if (player != 0) {
        this.updateScore(player, 1);
        b.reset();
      }
    }
    if (this.checkWallCollision(b.getPos(), b.getSize())) {
      b.setVel({ x: b.getVel().x, y: b.getVel().y * -1 });
      this.addCollisionEvent(b.getPos(), 'Wall');
    }
    b.update();
  }

  checkWallCollision(pos: Vector3, size: Vector3): boolean {
    if (pos.y > this.dimension.y - size.y || pos.y < 0) {
      return true;
    }
    return false;
  }

  checkScoreCollision(pos: Vector3, size: Vector3): number {
    if (pos.x > this.dimension.x - size.x || pos.x < 0) {
      if (pos.x < 0) return 1;
      return 2;
    }
    return 0;
  }

  checkVictory(): boolean {
    if (
      this.score[0] === this.score_to_win ||
      this.score[1] === this.score_to_win
    ) {
      if (this.score[0] === this.score_to_win) this.winner = 1;
      else this.winner = 2;
      this.addVictoryEvent(this.winner);
      this.victory = true;
      this.finished = true;
      return true;
    }
    return false;
  }

  updatePads() {
    // WARNING ai for testing purpose
    if (this.getPad1().isAI()) {
      if (
        this.getPad1().getPos().y + this.getPad1().getSize().y / 2 <
        this.ball.getPos().y
      )
        this.getPad1().moveBy({ x: 0, y: 3 });
      else this.getPad1().moveBy({ x: 0, y: -3 });
    } else this.getPad1()?.update();
    if (this.getPad2().isAI())
      if (
        this.getPad2().getPos().y + this.getPad2().getSize().y / 2 <
        this.ball.getPos().y
      )
        this.getPad2().moveBy({ x: 0, y: 2 });
      else this.getPad2().moveBy({ x: 0, y: -2 });
    else this.getPad2()?.update();
  }

  updateScore(player_num: number, n: number) {
    if (player_num >= 1 && player_num <= 2) {
      this.score[player_num - 1]++;
      this.addScoreEvent();
      this.checkVictory();
    }
  }

  addEvent(event: Event) {
    if (this.events.length >= 100) this.events.pop;
    this.events.push(event);
  }

  addCollisionEvent(pos: Vector3, type: string) {
    this.addEvent({
      type: EventType.Collision,
      payload: { pos: pos, type: type },
    });
  }

  addScoreEvent() {
    this.addEvent({
      type: EventType.Score,
      payload: { p1: this.score[0], p2: this.score[1] },
    });
  }

  addVictoryEvent(player: number) {
    this.addEvent({ type: EventType.Victory, payload: player });
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  finish() {
    this.finished = true;
  }

  isStarted(): boolean {
    return this.started;
  }

  isRunning(): boolean {
    return this.paused && this.started;
  }

  isPaused(): boolean {
    return this.paused;
  }

  isFinished(): boolean {
    return this.finished;
  }

  isVictory(): boolean {
    return this.victory;
  }

  setPad1(pad: Pad) {
    this.pad1 = pad;
  }

  setPad2(pad: Pad) {
    this.pad2 = pad;
  }

  getPad(i: number): Pad | undefined {
    if (i === 1) return this.getPad1();
    if (i === 2) return this.getPad2();
    return undefined;
  }

  getPad1(): Pad {
    return this.pad1;
  }

  getPad2(): Pad {
    return this.pad2;
  }

  getScore(): number[] {
    return this.score;
  }

  getWinner(): number {
    return this.winner;
  }
}
