import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { Game } from './models';
import { WatchService } from './services/watch.service';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss']
})
export class WatchComponent implements OnInit {

	games: Game[] = []
	threeD: boolean = false;
	

  constructor(private watchService: WatchService) { }

  ngOnInit(): void {
  }

	async getGames(){
		this.watchService.getGames().pipe(take(1)).subscribe({
      next: (games) => {
        this.games = games;
        //console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
	}

	logDefault() {
		return console.log('default');
	}

	logProcess() {
		return console.log('process');
	}

	logSuccess() {
		return console.log('Success');
	}

	set3D(flag: boolean) {
		this.threeD = flag;
	}

}
