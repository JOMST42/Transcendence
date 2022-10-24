import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WatchRoutingModule } from './watch-routing.module';
import { WatchComponent } from './watch.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    WatchComponent,
  ],
  imports: [
    CommonModule,
    WatchRoutingModule,
		SharedModule,
  ]
})
export class WatchModule { }
