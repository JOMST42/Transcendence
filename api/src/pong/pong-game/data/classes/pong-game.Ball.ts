import { Vector3, Collision } from '../interfaces';
import { Entity, Pad } from '.';
import { CollisionType } from '../enums';
import { checkCollisionBox } from '../../pong-game.utils';

export class Ball extends Entity {
  private speed_hit_multi: number;
  private last_player_hit = 0;
  private radius: number;

  constructor(p: Vector3, radius: number, speed: number, speed_multi: number) {
    super(true, true, false, true);
    this.pos = p;
    this.setSize({ x: radius, y: radius });
    this.radius = radius;
    this.base_speed = speed;
    this.speed_hit_multi = speed_multi;
    this.speed = speed;
    this.setRandomDirection();
  }

  override onCollision(col: Collision) {
    const this_center = this.getCenter();
    const col_center = col.target.getCenter();
    const col_half_size = col.target.getSize().y / 2;
    let dy: number;
    let size_ratio: number;
    let sign: number;
    let new_vx: number;
    let new_vy: number;

    dy = Math.abs(col_center.y - this_center.y);
    size_ratio = dy / col_half_size;
    if (size_ratio > 0.8) size_ratio = 0.8;

    if (this.velocity.x > 0) sign = -1;
    else sign = 1;

    this.speed *= this.speed_hit_multi;
    new_vy = Math.sqrt(Math.pow(this.speed, 2) * size_ratio);
    new_vx = Math.sqrt(Math.pow(this.speed, 2) - Math.pow(new_vy, 2));
    if (this_center.y < col_center.y) new_vy *= -1;
    new_vx *= sign;
    this.setVel({ x: new_vx, y: new_vy });
  }

  setRandomDirection() {
    let new_vx: number;
    let new_vy: number;
    let sin_y: number;
    let deg_y: number;

    deg_y = 10 + Math.random() * 30;
    sin_y = Math.sin(deg_y * (Math.PI / 100));
    new_vy = Math.sqrt(Math.pow(this.speed, 2) * sin_y);
    new_vx = Math.sqrt(Math.pow(this.speed, 2) - Math.pow(new_vy, 2));
    this.setVel({
      x: new_vx * (Math.random() - 0.5 > 0 ? 1 : -1),
      y: new_vy * (Math.random() - 0.5 > 0 ? 1 : -1),
    });
  }

  setRadius(r: number) {
    this.radius = r;
    this.setSize({ x: r, y: r });
  }

  getRadius(): number {
    return this.radius;
  }

  setLastHit(p: number) {
    this.last_player_hit = p;
  }

  getLastHit(): number {
    return this.last_player_hit;
  }

  reset() {
    this.setPos({ x: 300, y: 200 });
    this.setSpeed(this.base_speed);
    this.setLastHit(0);
    this.setRandomDirection();
  }

  checkPadCollision(pad: Pad): Collision | undefined {
    let col: Collision | undefined;
    let pos_col: Vector3 | undefined;

    if (pad.getId() === this.getLastHit()) return undefined;
    pos_col = checkCollisionBox(
      this.getPos(),
      { x: this.radius, y: this.radius },
      pad.getPos(),
      pad.getSize(),
    );

    if (!pos_col) return undefined;
    col = {
      pos: { x: pos_col.x, y: pos_col.y },
      src_type: CollisionType.Ball,
      target_type: CollisionType.Pad,
      src: this,
      target: pad,
      force: this.speed,
    };

    this.setLastHit(pad.getId());
    this.onCollision(col);
    return col;
  }
}
