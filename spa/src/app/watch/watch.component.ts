import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { Game } from './models';
import { WatchService } from './services/watch.service';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss'],
})
export class WatchComponent implements OnInit {
  games: Game[] = [];
  threeD: boolean = false;

  constructor(private watchService: WatchService) {}

  ngOnInit(): void {}

  async getGames() {
    this.watchService
      .getGames()
      .pipe(take(1))
      .subscribe({
        next: (games) => {
          this.games = games;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  set3D(flag: boolean) {
    this.threeD = flag;
  }
}
