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
  win: Game[] = [];
  lost: Game[] = [];
  timePlayed: number = 0;
  
  @Input() user!: User; //je recupère le user depuis le component de la profile-page

  ngOnInit(): void {
    this.userService
      .getGamesByUserId(this.user.id)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.games = data;
		  this.games.forEach((game: Game) => {
			console.log(this.timePlayed);
			this.timePlayed += game.timePlayed;
		  });
		   //je recupère toutes les games du joueurs
          console.log(data);
        },
        error: (err) => {
          console.log('pas de games trouvées');
        },
      });

	  this.watchService
	  .getGamesWonByUserId(this.user.id)
	  .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.win = data;
		   //je recupère toutes les games du joueurs
          console.log(data);
        },
        error: (err) => {
          console.log('pas de games trouvées');
        },
	});

	this.watchService
	  .getGamesLostByUserId(this.user.id)
	  .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.lost = data;
		   //je recupère toutes les games du joueurs
          console.log(data);
        },
        error: (err) => {
          console.log('pas de ldoy trouvées');
        },
	});


  }

}
