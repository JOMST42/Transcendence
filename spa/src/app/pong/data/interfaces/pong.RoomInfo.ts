import { User } from "src/app/user/models";
import { Score } from ".";
import { RoomState, Winner } from "../enums";

export interface RoomInfo {
  prismaId: number;
  roomId: string;
  user1: User;
  user2: User;
  score: Score;
  scoreToWin: number;
  state: RoomState;
  time: number;
	hasCountdown: boolean;
	countdownTime: number;
	countdownLabel: string;
  winner: Winner;
}