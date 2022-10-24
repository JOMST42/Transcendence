import { Vector3, Collision } from '../interfaces';
import { CollisionType } from '../enums';
import { calculateVect3, checkCollisionBox } from '../pong-game.utils';

export class Entity {
  protected pos!: Vector3;
  protected size!: Vector3;
  protected velocity!: Vector3;

  protected base_speed!: number;
  protected max_speed!: number;
  protected speed!: number;
  protected accel!: number;

  protected f_enabled = false;
  protected f_collider = false;
  protected f_gravity = false;
  protected f_movable = false;

  constructor(
    enabled: boolean,
    collider: boolean,
    gravity: boolean,
    movable: boolean,
  ) {
    this.f_enabled = enabled;
    this.f_collider = collider;
    this.f_gravity = gravity;
    this.f_movable = movable;

    this.pos = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.size = { x: 0, y: 0 };
    this.base_speed = 0;
    this.max_speed = 1000;
    this.speed = 0;
    this.accel = 0;
  }

  update() {
    if (this.isMovable()) this.applyVelocity();
  }

  checkCollision(collider: Entity): boolean {
    const new_pos: Vector3 = { x: 0, y: 0 };

    new_pos.x = this.getPos().x + this.getVel().x;
    new_pos.y = this.getPos().y + this.getVel().y;

    let x_collided = false;
    let y_collided = false;
    const min_x: number = this.getPos().x;
    const min_y: number = this.getPos().y;
    const max_x: number = this.getPos().x + this.getSize().x;
    const max_y: number = this.getPos().y + this.getSize().y;
    const col_min_x: number = collider.getPos().x;
    const col_min_y: number = collider.getPos().y;
    const col_max_x: number = collider.getPos().x + collider.getSize().x;
    const col_max_y: number = collider.getPos().y + collider.getSize().y;

    if (col_min_x > min_x && col_min_x < max_x) x_collided = true;
    else if (min_x > col_min_x && min_x < col_max_x) x_collided = true;
    if (col_min_y > min_y && col_min_y < max_y) y_collided = true;
    else if (min_y > col_min_y && min_y < col_max_y) y_collided = true;
    if (x_collided && y_collided)
      this.onCollision({
        pos: { x: 0, y: 0 },
        src_type: CollisionType.Unknown,
        target_type: CollisionType.Unknown,
        src: this,
        target: collider,
        force: 0,
      });
    return x_collided && y_collided;
  }

  onCollision(collider: Collision) {
    return;
  }

  moveToward(dir: string) {
    if (!this.isMovable()) return;
    switch (dir) {
      case 'left':
        this.moveBy({ x: -this.speed, y: 0 });
        break;
      case 'right':
        this.moveBy({ x: this.speed, y: 0 });
        break;
      case 'up':
        this.moveBy({ x: 0, y: -5 });
        break;
      case 'down':
        this.moveBy({ x: 0, y: 5 });
        break;
    }
  }

  moveTo(pos: Vector3) {
    if (this.isMovable()) this.setPos(pos);
  }

  moveBy(pos: Vector3) {
    if (this.isMovable()) this.setPos(calculateVect3(this.pos, pos, '+'));
  }

  protected setPos(p: Vector3) {
    this.pos = p;
  }

  getPos(): Vector3 {
    return this.pos;
  }

  getCenter(): Vector3 {
    const center: Vector3 = { x: 0, y: 0 };
    center.x = this.getPos().x + this.getSize().x * 0.5;
    center.y = this.getPos().y + this.getSize().y * 0.5;
    return center;
  }

  setVel(v: Vector3) {
    this.velocity = v;
  }

  getVel(): Vector3 {
    return this.velocity;
  }

  multiplyVelocity(multiplier: number) {
    this.setVel(calculateVect3(this.velocity, multiplier, '*'));
  }

  applyVelocity() {
    // this.moveBy(calculateVect3(this.getVel(), 1 / 60, '*')); // TODO fps
    this.moveBy(this.getVel()); // TODO fps
  }

  addVelocity(vel: Vector3) {
    this.velocity = { x: this.velocity.x + vel.x, y: this.velocity.y + vel.y }; // TODO fps
  }

  setSize(s: Vector3) {
    this.size = s;
  }

  getSize(): Vector3 {
    return this.size;
  }

  setSpeed(s: number) {
    this.speed = s;
    if (this.speed > this.max_speed) this.speed = this.max_speed;
  }
  getSpeed(): number {
    return this.speed;
  }

  setAccel(a: number) {
    this.accel = a;
  }
  getAccel(): number {
    return this.accel;
  }
  applyAccel() {
    this.setVel(calculateVect3(this.velocity, this.accel, '+'));
  }

  setEnabled(flag: boolean) {
    this.f_enabled = flag;
  }
  setCollider(flag: boolean) {
    this.f_collider = flag;
  }
  setGravity(flag: boolean) {
    this.f_gravity = flag;
  }
  setMovable(flag: boolean) {
    this.f_movable = flag;
  }

  isEnabled(): boolean {
    return this.f_enabled;
  }
  isCollider(): boolean {
    return this.f_collider;
  }
  isGravity(): boolean {
    return this.f_gravity;
  }
  isMovable(): boolean {
    return this.f_movable;
  }
}
