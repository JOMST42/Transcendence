import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './components';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { ChatChannelListComponent } from './components/chat-channel-list/chat-channel-list.component';
import { ChatChannelComponent } from './components/chat-channel/chat-channel.component';
import { ChatMessageListComponent } from './components/chat-message-list/chat-message-list.component';
import { ChatUserListComponent } from './components/chat-user-list/chat-user-list.component';
import { ChatUserComponent } from './components/chat-user/chat-user.component';
import { ChatFriendListComponent } from './components/chat-friend-list/chat-friend-list.component';
import { ChatFriendComponent } from './components/chat-friend/chat-friend.component';

@NgModule({
  declarations: [ChatComponent, ChatRoomComponent, ChatMessageComponent, ChatChannelListComponent, ChatChannelComponent, ChatMessageListComponent, ChatUserListComponent, ChatUserComponent, ChatFriendListComponent, ChatFriendComponent],
  imports: [SharedModule, ChatRoutingModule],
})
export class ChatModule {}
