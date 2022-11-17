import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
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
import { RouterModule } from '@angular/router';
import { SearchUserComponent } from './components/search-user/search-user.component';
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component';
import { MatchHistoryComponent } from './components/match-history/match-history.component';

@NgModule({
  declarations: [
    NotFoundComponent,
    ServerErrorComponent,
    NavBarComponent,
    PongScreenComponent,
    PongAudioComponent,
    EventButtonComponent,
    JoinGameDialogComponent,
    SearchUserComponent,
    UserAvatarComponent,
		MatchHistoryComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    DialogModule,
    AvatarModule,
    RouterModule,
    TabViewModule,
    CardModule,
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
    DialogModule,
    TabViewModule,
    CardModule,
    SearchUserComponent,
    UserAvatarComponent,
		MatchHistoryComponent,
    InputTextareaModule,
  ],
})
export class SharedModule {}
