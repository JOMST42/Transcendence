import { NgModule } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';

import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared';
import { FriendListComponent } from './components/friend-list/friend-list.component';
import { ProfileImgComponent } from './components/profile-img/profile-img.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';

@NgModule({
  declarations: [
    FriendListComponent,
    ProfileImgComponent,
    ProfilePageComponent,
  ],
  imports: [SharedModule, UserRoutingModule, FileUploadModule],
})
export class UserModule {}
