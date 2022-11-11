import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { AvatarModule } from 'primeng/avatar';
import { InputTextareaModule } from 'primeng/inputtextarea';

import {
  JoinGameDialogComponent,
  NavBarComponent,
  NotFoundComponent,
  PongAudioComponent,
  PongScreenComponent,
  ServerErrorComponent,
} from './components';
import { EventButtonComponent } from './components/event-button/event-button.component';

@NgModule({
  declarations: [
    NotFoundComponent,
    ServerErrorComponent,
    NavBarComponent,
    PongScreenComponent,
    PongAudioComponent,
    EventButtonComponent,
    JoinGameDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    DialogModule,
    AvatarModule,
    InputTextareaModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    PongScreenComponent,
    PongAudioComponent,
    EventButtonComponent,
    NavBarComponent,
    InputTextModule,
    JoinGameDialogComponent,
    AvatarModule,
    InputTextareaModule,
  ],
})
export class SharedModule {}
