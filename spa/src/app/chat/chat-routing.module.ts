import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatRoomResolver } from './chat-room.resolver';

import { ChatComponent } from './components';

const routes: Routes = [
  { path: '', component: ChatComponent, resolve: { rooms: ChatRoomResolver } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoutingModule {}
