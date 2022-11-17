import { NgModule } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';

import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared/shared.module';
import {
  FriendListComponent,
  ProfilePageComponent,
  UserImgComponent,
  UserDisplaynameComponent,
} from './components';
import { FriendBtnComponent } from './components/friends/friend-btn/friend-btn.component';
import { BlockedBtnComponent } from './components/friends/blocked-btn/blocked-btn.component';
import { FriendCardComponent } from './components/friends/friend-card/friend-card.component';

@NgModule({
  declarations: [
    FriendListComponent,
    ProfilePageComponent,
    UserImgComponent,
    UserDisplaynameComponent,
    FriendBtnComponent,
    BlockedBtnComponent,
    FriendCardComponent,
  
  ],
  imports: [SharedModule, UserRoutingModule, FileUploadModule],
  exports: [
    UserDisplaynameComponent,
    UserImgComponent,
    FileUploadModule,
    UserRoutingModule,
    ProfilePageComponent,
    FriendListComponent,
  ],
})
export class UserModule {}
