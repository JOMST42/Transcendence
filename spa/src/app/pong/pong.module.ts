import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { GameRoutingModule } from '../play/play-routing.module';
import { GameInviteComponent } from './game-invite/game-invite.component';
import { InviteDialogComponent } from './invite-dialog/invite-dialog.component';

@NgModule({
  declarations: [
		GameInviteComponent,
		InviteDialogComponent,
	],
  imports: [DialogModule, ButtonModule, CommonModule],
	exports: [GameInviteComponent, InviteDialogComponent],
  providers: [],
})
export class PongModule {}