import { Time } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { take } from 'rxjs';
import { User } from 'src/app/user/models';
import { UserService } from 'src/app/user/services';
import { Game } from 'src/app/watch/models';
import { WatchService } from 'src/app/watch/services/watch.service';

export interface UserMatch{
	id?: number;
	opponent?: Opponent;
	info?: string;
	win?: boolean;
	score?: {you: number, them: number};
	timePlayed?: number;
	timeString?: string;
	date?: Date;
	dateString?: string;
}

export interface Opponent {
  name?: string;
  img?: string;
}

@Component({
  selector: 'app-user-match-history',
  templateUrl: './user-match-history.component.html',
  styleUrls: ['./user-match-history.component.scss']
})
export class UserMatchHistoryComponent implements OnInit {

	@ViewChild('matchTable', { static: false })
	private matchTable! : Table;

	games: Game[] = [];
	activeMatches: UserMatch[];
	opponents: Opponent[]
	@Input() user!: User;
  loading: boolean = true;


  constructor(private userService: UserService, private watchService: WatchService) { }
    


	ngOnInit() {

		this.refreshMatches();
		this.loading = false;
		this.initTable();
	}

	async initTable() {
		if (!this.matchTable) setTimeout(() => this.initTable(), 1000);
		else this.matchTable.reset();
	}

	async refreshMatches() {
		this.activeMatches = [];
		this.opponents = [];

		let i = 0;
		this.watchService.getGamesByUserId(this.user.id).pipe(take(1)).subscribe({
      next: (games) => {
        games.forEach(async (game: Game) => {
					i++;
					await this.gameToMatch(game).then((match) => {
						this.activeMatches.push(match)
					});
				});
      },
      error: (err) => {
        console.log(err);
      },
    });
		if (this.matchTable) this.matchTable.reset();
	}

	async gameToMatch(game: Game): Promise<UserMatch> {
		let match: UserMatch = {};
		let tempUser: User | null;
		let opponentPn: number;
		let opponentId: number
		
		if (this.user.id === game.player1Id) {
			 opponentId = game.player2Id;
			 opponentPn = 2;
		} else {
			opponentId = game.player1Id;
			opponentPn = 1;
		}
		return new Promise<UserMatch>(async (resolve, reject) => {
			await new Promise((resolve, reject) => {
				this.userService.getUserById(opponentId).pipe(take(1)).subscribe({
					next: (user) => {
						match.opponent = {name:user.displayName, img:user.avatarUrl};
						if (!this.opponents.find((opponent) => {return opponent.name === match.opponent.name;}))
							this.opponents.push(match.opponent);
						resolve(null);
					},
					error: (err) => {
						reject();
					},
				});
			});

			match.date = this.parseISOString(game.startTime);
			match.dateString = this.dateToString(match.date);
			match.id = game.id;
			if (opponentPn === 1) match.score = {you:game.scorePlayer2, them:game.scorePlayer1};
			if (opponentPn === 2) match.score = {you:game.scorePlayer1, them:game.scorePlayer2};
			
			match.win = (game.winner === 'PLAYER1' && opponentPn === 2) || (game.winner === 'PLAYER2' && opponentPn === 1);
			match.timePlayed = game.timePlayed;
			match.timeString = this.numToMMSS(game.timePlayed);
			resolve(match);
		});
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

	parseISOString(s): Date {
		if (!s)
			return null;
		var b = s.split(/\D+/);
		return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
	}

	dateToString(date: Date): string  {
		if (!date)
			return '';
		return date.getFullYear() + '/' +
			date.getMonth() + '/' +
			date.getDay() + ' ' +
			date.getHours() + ':' +
			date.getMinutes()
	}

  clear(table: Table) {
    table.clear();
  }

}
