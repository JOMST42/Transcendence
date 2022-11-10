import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChatRoomResolver } from './chat-room.resolver';
import { ChatRoomListResolver } from './chat-room-list.resolver';
import { ChatComponent, ChatRoomComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: ChatComponent,
    resolve: { rooms: ChatRoomListResolver },
  },
  {
    path: ':id',
    component: ChatRoomComponent,
    resolve: { room: ChatRoomResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoutingModule {}
