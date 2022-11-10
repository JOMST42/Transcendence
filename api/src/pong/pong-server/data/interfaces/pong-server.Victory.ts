import { Score } from 'src/pong/pong-game/data/interfaces';
import { VictoryType } from '../enums';

export interface Victory {
  winner: number;
  score: Score;
  type: VictoryType;
  msg?: string;
}
