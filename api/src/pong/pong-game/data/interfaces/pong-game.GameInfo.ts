import { Vector3, Event, Score } from '.';

export interface EntityInfo {
  pos: Vector3;
  size: Vector3;
}

export interface GameInfo {
  ball: EntityInfo;
  pad1: EntityInfo;
  pad2: EntityInfo;
  score: Score;
  state: any;
  events: Event[];
}
