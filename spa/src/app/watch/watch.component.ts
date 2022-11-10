import { Component, OnInit } from '@angular/core';
import { Game } from './models';
import { WatchService } from './services/watch.service';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss']
})
export class WatchComponent implements OnInit {

	games: Game[] = []

  constructor(private watchService: WatchService) { }

  ngOnInit(): void {
  }

	async getGames(){
		this.watchService.getGames().subscribe({
      next: (data) => {
        this.games = data;
				console.log(data[1].id);
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

}
