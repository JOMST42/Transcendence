import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';

import {
	JoinGameDialogComponent,
  NavBarComponent,
  NotFoundComponent,
  PongAudioComponent,
  PongScreenComponent,
  ServerErrorComponent,
} from './components';
import { EventButtonComponent } from './components/event-button/event-button.component';
import { UserModule } from '../user/user.module';

@NgModule({
  declarations: [
    NotFoundComponent,
    ServerErrorComponent,
    NavBarComponent,
    PongScreenComponent,
    PongAudioComponent,
    EventButtonComponent,
		JoinGameDialogComponent
  ],
  imports: [CommonModule, FormsModule, ButtonModule, TableModule, DialogModule, RouterModule, AvatarModule],
  exports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    PongScreenComponent,
    PongAudioComponent,
		EventButtonComponent,
    NavBarComponent,
		JoinGameDialogComponent,
    AvatarModule,
  ],
})
export class SharedModule {}
