import { NgModule } from '@angular/core';
import { ChatComponent } from './components/chat/chat.component';
import { SharedModule } from '../shared';
import { ChatRoutingModule } from './chat-routing.module';

@NgModule({
  declarations: [ChatComponent],
  imports: [SharedModule, ChatRoutingModule],
})
export class ChatModule {}
