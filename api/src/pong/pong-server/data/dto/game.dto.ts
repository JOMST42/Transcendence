import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';
import { Winner } from '../enums';

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
