import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './components';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';

@NgModule({
  declarations: [ChatComponent, ChatRoomComponent, ChatMessageComponent],
  imports: [SharedModule, ChatRoutingModule],
})
export class ChatModule {}
