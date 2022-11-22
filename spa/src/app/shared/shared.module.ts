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
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ChipModule } from 'primeng/chip';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';

import {
  NavBarComponent,
  NotFoundComponent,
  PongAudioComponent,
  PongScreenComponent,
  ServerErrorComponent,
} from './components';
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
    DynamicDialogModule,
    AutoCompleteModule,
    ChipModule,
    DropdownModule,
    PasswordModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    PongScreenComponent,
    PongAudioComponent,
    NavBarComponent,
    InputTextModule,
    AvatarModule,
    DialogModule,
    TabViewModule,
    CardModule,
    SearchUserComponent,
    UserAvatarComponent,
    MatchHistoryComponent,
    InputTextareaModule,
    DynamicDialogModule,
    AutoCompleteModule,
    ChipModule,
    DropdownModule,
    PasswordModule,
  ],
})
export class SharedModule {}
