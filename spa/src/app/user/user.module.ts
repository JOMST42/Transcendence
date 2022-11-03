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
import { AddFriendBtnComponent } from './components/friends/add-friend-btn/add-friend-btn.component';

@NgModule({
  declarations: [
    FriendListComponent,
    ProfilePageComponent,
    UserImgComponent,
    UserDisplaynameComponent,
    AddFriendBtnComponent,
  ],
  imports: [SharedModule, UserRoutingModule, FileUploadModule],
})
export class UserModule {}
