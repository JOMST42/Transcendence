export interface Game {
  id: number;
	player1Id: number;
	player2Id: number;
	startTime?: Date;
  endTime?: Date;
  scorePlayer1: number;
	scorePlayer2: number;
	winner?: string;
  firstName?: string;
	timePlayed?: number;
  description?: string;
}
