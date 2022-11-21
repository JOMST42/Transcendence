import { Component, Input, OnInit } from '@angular/core';
import { UserChatRoom } from '../../models';
import { avatarLabel } from '../../utils';

@Component({
  selector: 'app-chat-user',
  templateUrl: './chat-user.component.html',
  styleUrls: ['./chat-user.component.scss'],
})
export class ChatUserComponent implements OnInit {
  @Input() user: UserChatRoom;
  label: string;

  constructor() {}

  ngOnInit(): void {
    this.label = avatarLabel(this.user.user.displayName);
  }
}
