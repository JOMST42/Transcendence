import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/services';
import { Game } from '../../../watch/models';
import { User } from '../../models';
import { UserService } from '../../services';

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.scss'],
})
export class UserStatsComponent implements OnInit, OnDestroy {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  private unsubscribeAll$ = new Subject<void>();

  games!: Game[];

  @Input() user!: User; //je recupère le user depuis le component de la profile-page

  ngOnInit(): void {
    this.userService
      .getGamesByUserId(this.user.id)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (data) => {
          this.games = data; //je recupère toutes les games du joueurs
          console.log(data);
        },
        error: (err) => {
          console.log('pas de games trouvées');
        },
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next();
  }
}
