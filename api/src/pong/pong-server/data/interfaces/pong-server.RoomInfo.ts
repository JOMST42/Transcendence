import { User, Winner } from '@prisma/client';
import { Score } from 'src/pong/pong-game/data/interfaces';
import { RoomState } from '../enums';

export interface RoomInfo {
  prismaId: number;
  roomId: string;
  user1: User;
  user2: User;
  score: Score;
  state: RoomState;
  time: number;
  winner: Winner;
}
