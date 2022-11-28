import { Time } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { take } from 'rxjs';
import { User } from 'src/app/user/models';
import { UserService } from 'src/app/user/services';
import { Game } from 'src/app/watch/models';
import { WatchService } from 'src/app/watch/services/watch.service';

export interface Match{
	id?: number;
	p1?: {name: string, img: string};
	p2?: {name: string, img: string};
	winner?: string;
	score?: {p1: number, p2: number};
	timePlayed?: number;
	timeString?: string;
	date?: Date;
	dateString?: string;
}

@Component({
  selector: 'app-match-history',
  templateUrl: './match-history.component.html',
  styleUrls: ['./match-history.component.scss']
})
export class MatchHistoryComponent implements OnInit {

	cols: any[];
	games: Game[] = [];
	matches: Match[];
	activeMatches: Match[];
	@Input() user!: User;

	statuses: any[];

    loading: boolean = true;

    activityValues: number[] = [0, 100];

  constructor(private userService: UserService, private watchService: WatchService) { }
    


    ngOnInit() {
        this.cols = [
					{ field: 'id', header: 'Game ID' },
					{ field: 'p1', header: 'Player 1' },
					{ field: 'p2', header: 'Player 2' },
					{ field: 'score', header: 'Score' },
					{ field: 'timePlayed', header: 'Time Played' },
					{ field: 'date', header: 'Date' },
        ];
				this.refreshMatches();
				this.loading = false;
    }

	async refreshMatches() {
		let tempMatch: Match = {};
		this.activeMatches = [];

		this.watchService.getGamesByUserId(this.user.id).pipe(take(1)).subscribe({
      next: (games) => {
        games.forEach(async (game: Game) => {
					await this.gameToMatch(game).then((match) => {
						this.activeMatches.push(match)
					});
				});
      },
      error: (err) => {
        console.log(err);
      },
    });
	}

	async gameToMatch(game: Game): Promise<Match> {
		let match: Match = {};
		let tempUser: User | null;

		return new Promise<Match>(async (resolve, reject) => {
			await new Promise((resolve, reject) => {
				this.userService.getUserById(game.player1Id).pipe(take(1)).subscribe({
					next: (user) => {
						match.p1 = {name:user.displayName, img:user.avatarUrl};
						resolve(null);
					},
					error: (err) => {
						reject();
					},
				});
			});

			await new Promise((resolve, reject) => {
				this.userService.getUserById(game.player2Id).pipe(take(1)).subscribe({
					next: (user) => {
						match.p2 = {name:user.displayName, img:user.avatarUrl};
						resolve(null);
					},
					error: (err) => {
						reject();
					},
				});
			});

			match.date = game.endTime;
			// match.dateString = this.dateToString(match.date);
			match.id = game.id;
			match.score = {p1:game.scorePlayer1, p2:game.scorePlayer2};
			match.winner = game.winner;
			match.timePlayed = game.timePlayed;
			match.timeString = this.numToMMSS(game.timePlayed);
			resolve(match);
		});
	}

	fetchUserGames()
	{
	}

	numToMMSS(time: number): string  {
		let seconds = Math.trunc(time % 60);
		let minutes = Math.trunc(time / 60);
		let numString : string = '';
		if (minutes < 10) numString += '0';
		numString += minutes + ':';
		if (seconds < 10) numString += '0';
		numString += seconds;
		return numString;
	}

  clear(table: Table) {
    table.clear();
  }

}
