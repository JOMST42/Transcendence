import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './play-routing.module';
import { GameComponent } from './game.component';
import { FormsModule } from '@angular/forms';
import { ModeSelectComponent } from './mode-select/mode-select.component';
import { PongInputComponent } from './pong-input/pong-input.component';
import { SharedModule } from '../shared/shared.module';
import { QueueButtonComponent } from './ui/queue-button/queue-button.component';
import { JoinGameButtonComponent } from './ui/join-game-button/join-game-button.component';
import { QueueWidjetComponent } from './ui/queue-widjet/queue-widjet.component';
import { ReadyButtonComponent } from './ui/ready-button/ready-button.component';
import { JoinGameDialogComponent } from './ui/join-game-dialog/join-game-dialog.component';
import { CoreModule } from '../core/core.module';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
		GameComponent,
		ModeSelectComponent,
		PongInputComponent,
		QueueButtonComponent,
		JoinGameButtonComponent,
		QueueWidjetComponent,
		ReadyButtonComponent,
		JoinGameDialogComponent
	],
  imports: [CommonModule, GameRoutingModule, FormsModule, SharedModule, DialogModule],
  providers: [],
})
export class PlayModule {}
