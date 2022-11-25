import { Component, HostListener, OnInit } from '@angular/core';
import { PlayService } from '../../../play/play.service';

export enum KEYS {
	UP = "ArrowUp",
	DOWN = "ArrowDown",
	RIGHT = "ArrowRight",
	LEFT = "ArrowLeft"
}

@Component({
  selector: 'app-pong-input',
  templateUrl: './pong-input.component.html',
  styleUrls: ['./pong-input.component.scss'],
})
export class PongInputComponent implements OnInit {

  constructor(private server: PlayService) { }

  ngOnInit(): void {
  }

	@HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) { 
    switch(event.key) {
			case KEYS.UP:
				this.moveStart("up");
				event.preventDefault();
				break;
			case KEYS.DOWN:
				this.moveStart("down");
				event.preventDefault();
				break;
		}
  }

	@HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) { 
    switch(event.key) {
			case KEYS.UP:
				this.moveEnd("up");
				event.preventDefault();
				break;
			case KEYS.DOWN:
				this.moveEnd("down");
				event.preventDefault();
				break;
		}
  }

	moveStart(direction: string) {
		this.server.emit("move-start", direction);
	}

	moveEnd(direction: string) {
		this.server.emit("move-end", direction);
	}

}
