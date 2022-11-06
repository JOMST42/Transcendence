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

@NgModule({
  declarations: [
    FriendListComponent,
    ProfilePageComponent,
    UserImgComponent,
    UserDisplaynameComponent,
  ],
  imports: [SharedModule, UserRoutingModule, FileUploadModule],
  exports: [
    UserDisplaynameComponent,
    UserImgComponent,
    FileUploadModule,
    UserRoutingModule,
    ProfilePageComponent,
    FriendListComponent
  ]
})
export class UserModule {}
