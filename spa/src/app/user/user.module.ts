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
import { FriendRequestsComponent } from './components/friends/friend-requests/friend-requests.component';
import { FriendRequestCardComponent } from './components/friends/friend-request-card/friend-request-card.component';

@NgModule({
  declarations: [
    FriendListComponent,
    ProfilePageComponent,
    UserImgComponent,
    UserDisplaynameComponent,
    FriendBtnComponent,
    BlockedBtnComponent,
    FriendCardComponent,
    FriendRequestsComponent,
    FriendRequestCardComponent,
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
