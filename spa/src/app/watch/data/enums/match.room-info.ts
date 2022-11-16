import { Score } from "src/app/shared/components";
import { User } from "src/app/user/models";

export interface RoomInfo {
  prismaId: number;
  roomId: string;
  user1: User;
  user2: User;
  score: Score;
  scoreToWin: number;
  state: any;
  time: number;
  winner: any;
}