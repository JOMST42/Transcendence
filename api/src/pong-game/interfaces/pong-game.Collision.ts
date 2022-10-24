import { Entity } from '../classes';
import { CollisionType } from '../enums';
import { Vector3 } from '.';

export interface Collision {
  pos: Vector3;
  src_type: CollisionType;
  target_type: CollisionType;
  src: Entity;
  target: Entity;
  force?: number;
}
