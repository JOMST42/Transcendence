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
import { UserInviteComponent } from './components/user-invite/user-invite.component';

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
    UserInviteComponent,
  ],
  imports: [SharedModule, ChatRoutingModule],
})
export class ChatModule {}
