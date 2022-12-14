import { Winner } from '@prisma/client';
import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';

// export class UpdateGameDto {
//   @IsDate()
//   @IsOptional()
//   startTime?: Date;

//   @IsDate()
//   @IsOptional()
//   endTime?: Date;

//   @IsInt()
//   player1Id: number;

//   @IsInt()
//   player2Id: number;

//   @IsOptional()
//   winner?: Winner;

//   @IsInt()
//   @IsOptional()
//   scorePlayer1?: number;

//   @IsInt()
//   @IsOptional()
//   scorePlayer2?: number;

//   @IsInt()
//   @IsOptional()
//   ballBounce?: number;

//   @IsInt()
//   @IsOptional()
//   longestRally?: number;

//   @IsString()
//   @IsOptional()
//   description?: string;
// }

export class CreateGameDto {
  @IsInt()
  player1Id: number;

  @IsInt()
  player2Id: number;

  @IsString()
  @IsOptional()
  description?: string;

  constructor(p1ID?: number, p2ID?: number, description?: string) {
    if (p1ID !== undefined) this.player1Id = p1ID;
    if (p2ID !== undefined) this.player2Id = p2ID;
    if (description === undefined) description = '';
    this.description = description;
  }
}

export class StartGameDto {
  @IsDate()
  @IsOptional()
  startTime?: Date;

  @IsString()
  @IsOptional()
  description?: string;
}

export class EndGameDto {
  @IsDate()
  @IsOptional()
  endTime?: Date;

  timePlayed: number;

  @IsOptional()
  winner?: Winner;

  @IsInt()
  @IsOptional()
  scorePlayer1?: number;

  @IsInt()
  @IsOptional()
  scorePlayer2?: number;

  @IsInt()
  @IsOptional()
  ballBounce?: number;

  @IsInt()
  @IsOptional()
  longestRally?: number;

  @IsString()
  @IsOptional()
  description?: string;
}
