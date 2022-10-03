import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared';

@NgModule({
  declarations: [],
  imports: [SharedModule, UserRoutingModule],
})
export class UserModule {}
