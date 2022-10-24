import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { PlayService } from './play.service';
import { FormsModule } from '@angular/forms';
import { ModeSelectComponent } from './mode-select/mode-select.component';
import { PongInputComponent } from './pong-input/pong-input.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    GameComponent,
  	ModeSelectComponent,
   	PongInputComponent,
  ],
  imports: [
    CommonModule,
    GameRoutingModule,
		FormsModule,
		SharedModule,
  ],
	providers: [PlayService],
})
export class PlayModule { }
