import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChatRoomListResolver } from './chat-room-list.resolver';
import { ChatComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: ChatComponent,
    resolve: { rooms: ChatRoomListResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoutingModule {}
