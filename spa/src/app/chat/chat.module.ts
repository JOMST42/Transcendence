import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './components';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';

@NgModule({
  declarations: [ChatComponent, ChatRoomComponent],
  imports: [SharedModule, ChatRoutingModule],
})
export class ChatModule {}
