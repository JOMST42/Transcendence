import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './play-routing.module';
import { GameComponent } from './components/game/game.component';
import { FormsModule } from '@angular/forms';
import { ModeSelectComponent } from './components/mode-select/mode-select.component';
import { SharedModule } from '../shared/shared.module';
import { QueueButtonComponent } from './ui/queue-button/queue-button.component';
import { JoinGameButtonComponent } from './ui/join-game-button/join-game-button.component';
import { QueueWidjetComponent } from './ui/queue-widjet/queue-widjet.component';
import { PongModule } from '../pong/pong.module';

@NgModule({
  declarations: [
		GameComponent,
		ModeSelectComponent,
		QueueButtonComponent,
		JoinGameButtonComponent,
		QueueWidjetComponent,
	],
  imports: [CommonModule, GameRoutingModule, FormsModule, SharedModule, PongModule],
  providers: [],
})
export class PlayModule {}
