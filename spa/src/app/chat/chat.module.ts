import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ChatRoutingModule } from './chat-routing.module';
import {
  ChannelCreateComponent,
  ChatChannelComponent,
  ChatChannelListComponent,
  ChatComponent,
  ChatMessageComponent,
  ChatMessageListComponent,
  ChatUserComponent,
  ChatUserListComponent,
} from './components';
import { UserInviteComponent } from './components/user-invite/user-invite.component';
import { PasswordDialogComponent } from './components/password-dialog/password-dialog.component';
import { UserDialogComponent } from './components/user-dialog/user-dialog.component';
import { PongModule } from '../pong/pong.module';
import { DmInviteComponent } from './components/dm-invite/dm-invite.component';

@NgModule({
  declarations: [
    ChatComponent,
    ChatMessageComponent,
    ChatChannelListComponent,
    ChatChannelComponent,
    ChatMessageListComponent,
    ChatUserListComponent,
    ChatUserComponent,
    ChannelCreateComponent,
    UserInviteComponent,
    PasswordDialogComponent,
    UserDialogComponent,
    DmInviteComponent,
  ],
  imports: [SharedModule, ChatRoutingModule, PongModule],
})
export class ChatModule {}
