import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { GameRoutingModule } from '../play/play-routing.module';
import { GameInviteComponent, InviteDialogComponent, JoinGameDialogComponent } from './components';
import { PongService } from './services/pong.service';

@NgModule({
  declarations: [
		GameInviteComponent,
		InviteDialogComponent,
		JoinGameDialogComponent,
	],
  imports: [DialogModule, ButtonModule, CommonModule],
	exports: [GameInviteComponent, InviteDialogComponent, JoinGameDialogComponent],
  providers: [PongService],
})
export class PongModule {}