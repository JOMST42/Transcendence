import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ChatRoutingModule } from './chat-routing.module';
import {
  ChannelCreateComponent,
  ChatChannelComponent,
  ChatChannelListComponent,
  ChatComponent,
  ChatFriendComponent,
  ChatFriendListComponent,
  ChatMessageComponent,
  ChatMessageListComponent,
  ChatUserComponent,
  ChatUserListComponent,
} from './components';

@NgModule({
  declarations: [
    ChatComponent,
    ChatMessageComponent,
    ChatChannelListComponent,
    ChatChannelComponent,
    ChatMessageListComponent,
    ChatUserListComponent,
    ChatUserComponent,
    ChatFriendListComponent,
    ChatFriendComponent,
    ChannelCreateComponent,
  ],
  imports: [SharedModule, ChatRoutingModule],
})
export class ChatModule {}
