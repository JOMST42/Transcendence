import { Component, OnInit } from '@angular/core';
import { GameInviteService } from '../services/game-invite.service';

@Component({
  selector: 'app-game-invite',
  templateUrl: './game-invite.component.html',
})
export class GameInviteComponent implements OnInit {

  constructor(private inviteService: GameInviteService) { }

  ngOnInit(): void {
  }

	invitePlayer(id2: number) {
		this.inviteService.invitePlayer(id2);
	}

	acceptInvite() {
		this.inviteService.acceptInvite();
	}

}
