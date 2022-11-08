import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { UserModule } from '../user/user.module';
import {
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
  ],
  imports: [CommonModule, FormsModule, ButtonModule, TableModule, RouterModule, ],
  exports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    PongScreenComponent,
    PongAudioComponent,
	EventButtonComponent,
    NavBarComponent,
  ],
})
export class SharedModule {}
