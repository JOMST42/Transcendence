import { UserModule } from './../user/user.module';
import { NgModule } from '@angular/core';

import { HomeComponent } from './components';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  declarations: [HomeComponent,],
  imports: [SharedModule, HomeRoutingModule, UserModule],
})
export class HomeModule {}
