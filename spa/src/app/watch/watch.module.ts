import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WatchRoutingModule } from './watch-routing.module';
import { WatchComponent } from './watch.component';
import { SharedModule } from '../shared/shared.module';
import { RoomListComponent } from './components/room-list/room-list.component';

@NgModule({
  declarations: [WatchComponent, RoomListComponent],
  imports: [CommonModule, WatchRoutingModule, SharedModule],
})
export class WatchModule {}
