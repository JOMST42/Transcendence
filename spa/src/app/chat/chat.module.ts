import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './components';

@NgModule({
  declarations: [ChatComponent],
  imports: [SharedModule, ChatRoutingModule],
})
export class ChatModule {}
