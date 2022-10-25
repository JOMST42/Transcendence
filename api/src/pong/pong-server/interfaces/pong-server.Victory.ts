import { VictoryType } from '../enums';

export interface Victory {
  winner: number;
  score: number[];
  type: VictoryType;
  msg?: string;
}
