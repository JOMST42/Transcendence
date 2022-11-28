import { Component, Input, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { WatchService } from 'src/app/watch/services/watch.service';
import { AuthService } from '../../../core/services';
import { Game } from '../../../watch/models';
import { User } from '../../models';
import { UserService } from '../../services';

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.scss'],
})
export class UserStatsComponent implements OnInit {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
	private readonly watchService: WatchService,
  ) {}

/*Games perdues et games gagnées
Ton plus grand ennemi
Ton meilleur copain de jeu*/

  games: Game[] = [];
	gamesFetched = false;

  wins: Game[] = [];
	winsFetched = false;
	victim?: User;

  losses: Game[] = [];
	lossesFetched = false
	nemesis?: User;
	
	winLossRatio: number = 0;

	buddy: User; 
  timePlayed: number = 0;
  
  @Input() user!: User; //je recupère le user depuis le component de la profile-page

  ngOnInit(): void {
    this.watchService
      .getGamesByUserId(this.user.id)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.games = data;
		  this.games.forEach((game: Game) => {
			this.timePlayed += game.timePlayed;
		  });
		   //je recupère toutes les games du joueurs
          console.log(data);
					this.gamesFetched = true;
        },
        error: (err) => {
					this.gamesFetched = true;
          console.log('pas de games trouvées');
        },
      });

	  this.watchService
	  .getGamesWonByUserId(this.user.id)
	  .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.wins = data;
					this.winsFetched = true;
		   //je recupère toutes les games du joueurs
          console.log(data);
        },
        error: (err) => {
					this.winsFetched = true;
          console.log('pas de games trouvées');
        },
	});

	this.watchService
	  .getGamesLostByUserId(this.user.id)
	  .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.losses = data;
					this.lossesFetched = true;
		   //je recupère toutes les games du joueurs
          console.log(data);
        },
        error: (err) => {
					this.lossesFetched = true;
          console.log('pas de ldoy trouvées');
        },
	});
	
	this.initStats()
  }

	async initStats() {
		if (!this.winsFetched || !this.lossesFetched || !this.gamesFetched) setTimeout(() => this.initStats(), 1000);
		else {
			if (this.losses.length === 0) this.winLossRatio = this.wins.length;
			else {
				this.winLossRatio = this.wins.length / this.losses.length;
			} 
		}
	}

	// getNemesis(array: Game[]): number {
	// 		if(array.length == 0)
	// 				return 0;
	// 		let modeMap = {};
	// 		let maxEl = array[0];
	// 		let maxCount = 1;
	// 		for(var i = 0; i < array.length; i++)	{
	// 				let el = array[i];
	// 				if(modeMap[el] == null)
	// 						modeMap[el] = 1;
	// 				else
	// 						modeMap[el]++;  
	// 				if(modeMap[el] > maxCount)
	// 				{
	// 						maxEl = el;
	// 						maxCount = modeMap[el];
	// 				}
	// 		}
	// 		return maxEl;
	// }

}
