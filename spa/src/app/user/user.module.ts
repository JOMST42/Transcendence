import { NgModule } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';

import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared/shared.module';
import {
  FriendListComponent,
  ProfileImgComponent,
  ProfilePageComponent,
} from './components';

@NgModule({
  declarations: [
    FriendListComponent,
    ProfileImgComponent,
    ProfilePageComponent,
  ],
  imports: [SharedModule, UserRoutingModule, FileUploadModule],
})
export class UserModule {}
