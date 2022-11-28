import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
} from '@angular/animations';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/user/services';
import { AudioHandler } from '../../../play/classes';
import { PlayService } from '../../../play/play.service';
import { EndState } from '../../enums';
import { GameInfo, RoomInfo, Score, Vector3 } from '../../interfaces';

@Component({
  selector: 'app-pong-end-overlay',
  templateUrl: './pong-end-overlay.component.html',
  styleUrls: ['./pong-end-overlay.component.scss'],
})
export class PongEndOverlayComponent implements OnInit {

  @Input() endState!: EndState;
	@Input() winnerAvatarUrl!: string;
	@Input() winnerName? : string;

	endHeader: string = '';
	endText: string = '';

	cancelHeader: string = "Game cancelled"
	cancelText: string = "A player has left"

	spectatorHeader: string = "Game ended!"
	spectatorText: string = "Winner: "

	winHeader: string = "WIN!"
	winText: string = "You've pwned "

	lossHeader: string = "Lost..."
	lossText: string = "You've been pwned by "
	


  constructor() {
	}

  ngOnInit(): void {
		switch (this.endState) {
			case EndState.CANCEL:
				this.winnerAvatarUrl = '';
				this.winnerName = '';
				this.endHeader = this.cancelHeader;
				this.endText = this.cancelText;
				break;
			case EndState.SPECTATOR:
				this.endHeader = this.spectatorHeader;
				this.endText = this.spectatorText;
				break;
			case EndState.WINNER:
				this.endHeader = this.winHeader;
				this.endText = this.winText;
				break;
			case EndState.LOSER:
				this.endHeader = this.lossHeader;
				this.endText = this.lossText;
				break;
		}

	}
		// if (this.isCancelled) {
		// 	this.winnerAvatarUrl = '';
		// 	this.winnerName = '';
		// 	this.endHeader = this.cancelHeader;
		// 	this.endText = this.cancelText;
		// } else if (this.isSpectator) {
		// 	this.endHeader = this.spectatorHeader;
		// 	this.endText = this.spectatorText;
		// } else if (this.isWin) {
		// 	this.endHeader = this.winHeader;
		// 	this.endText = this.winText;
		// } else if (!this.isWin) {
		// 	this.endHeader = this.lossHeader;
		// 	this.endText = this.lossText;
		// }
	// }

  ngAfterViewInit() {
		
  }
}
