import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/user/models';
import { GameInviteService } from '../../services/game-invite.service';

@Component({
  selector: 'app-game-invite',
  templateUrl: './game-invite.component.html',
})
export class GameInviteComponent implements OnInit {
	@Input() user!: User;

  constructor(private inviteService: GameInviteService) { }

  ngOnInit(): void {
  }

	invitePlayer() {
		this.inviteService.invitePlayer(this.user.id);
	}

}
