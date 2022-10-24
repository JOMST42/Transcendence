import { Vector3 } from '../interfaces';
import { applyFPS } from '../pong-game.utils';
import { Entity } from './index';

export class Pad extends Entity {
  private id!: number;
  private is_ai = false;
  private moving_up = false;
  private moving_down = false;

  constructor(id: number, pos: Vector3, size: Vector3, speed?: number) {
    super(true, true, false, true);
    this.setId(id);
    this.setPos(pos);
    this.setSize(size);
    if (!speed) speed = 500;
    this.base_speed = speed;
    this.setSpeed(speed);
  }

  override update() {
    // super.update();
    if (this.moving_up) {
      this.moveBy({ x: 0, y: -applyFPS(this.getSpeed()) });
      if (this.getPos().y < 0) this.moveTo({ x: this.getPos().x, y: 0 });
    }
    if (this.moving_down) {
      this.moveBy({ x: 0, y: applyFPS(this.getSpeed()) });
      if (this.getPos().y > 400 - this.getSize().y)
        this.moveTo({ x: this.getPos().x, y: 400 - this.getSize().y });
    }
  }

  setAI(flag: boolean) {
    this.is_ai = true;
  }

  isAI(): boolean {
    return this.is_ai;
  }

  private setId(id: number) {
    this.id = id;
  }

  getId(): number {
    return this.id;
  }

  setMovingUp(flag: boolean) {
    this.moving_up = flag;
  }

  setMovingDown(flag: boolean) {
    this.moving_down = flag;
  }
}
