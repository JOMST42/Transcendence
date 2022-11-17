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
  ChatRoomComponent,
  ChatUserComponent,
  ChatUserListComponent,
} from './components';
@NgModule({
  declarations: [
    ChatComponent,
    ChatRoomComponent,
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
