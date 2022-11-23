import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { GameRoutingModule } from '../play/play-routing.module';
import { SharedModule } from '../shared/shared.module';
import { GameInviteComponent, InviteDialogComponent, JoinGameDialogComponent, PongAudioComponent, PongInputComponent, PongScreenComponent } from './components';
import { Pong3DScreenComponent } from './components/pong-3dscreen/pong-3dscreen.component';
import { PongService } from './services/pong.service';

@NgModule({
  declarations: [
		GameInviteComponent,
		InviteDialogComponent,
		JoinGameDialogComponent,
		PongAudioComponent,
		PongScreenComponent,
		Pong3DScreenComponent,
		PongInputComponent,
	],
  imports: [DialogModule, ButtonModule, CommonModule, SharedModule],
	exports: [
		GameInviteComponent,
		InviteDialogComponent,
		JoinGameDialogComponent,
		PongAudioComponent,
		PongScreenComponent,
		PongInputComponent,
		Pong3DScreenComponent,
	],
  providers: [PongService],
})
export class PongModule {}