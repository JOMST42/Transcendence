import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { NbChatModule } from '@nebular/theme';

import {
  NavBarComponent,
  NotFoundComponent,
  PongAudioComponent,
  PongScreenComponent,
  ServerErrorComponent,
} from './components';

@NgModule({
  declarations: [
    NotFoundComponent,
    ServerErrorComponent,
    NavBarComponent,
    PongScreenComponent,
    PongAudioComponent,
  ],
  imports: [CommonModule, FormsModule, ButtonModule, TableModule, NbChatModule],
  exports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    PongScreenComponent,
    PongAudioComponent,
    NavBarComponent,
    NbChatModule,
  ],
})
export class SharedModule {}
