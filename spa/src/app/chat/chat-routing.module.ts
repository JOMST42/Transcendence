import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlockerUsersResolver } from './blocker-users.resolver';

import { ChatRoomListResolver } from './chat-room-list.resolver';
import { ChatComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: ChatComponent,
    resolve: { rooms: ChatRoomListResolver, blocked: BlockerUsersResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoutingModule {}
