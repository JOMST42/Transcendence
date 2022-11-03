import { Vector3, Event } from '.';

export interface GameInfo {
  b_pos: Vector3;
  p1_pos: Vector3;
  p2_pos: Vector3;
  b_rad: number;
  p1_size: Vector3;
  p2_size: Vector3;
  events: Event[];
}
