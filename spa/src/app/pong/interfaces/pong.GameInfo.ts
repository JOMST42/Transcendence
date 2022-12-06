import { EntityInfo, Score } from ".";

export interface GameInfo {
  ball: EntityInfo;
  pad1: EntityInfo;
  pad2: EntityInfo;
  score: Score;
  events: Event[];
}
