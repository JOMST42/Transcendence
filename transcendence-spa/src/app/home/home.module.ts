import { NgModule } from '@angular/core';

import { SharedModule } from '../shared';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [SharedModule, HomeRoutingModule],
})
export class HomeModule {}
