import { Component, Input, OnInit } from '@angular/core';
import { UserChatRoom } from '../../models';

@Component({
  selector: 'app-chat-user-list',
  templateUrl: './chat-user-list.component.html',
  styleUrls: ['./chat-user-list.component.scss'],
})
export class ChatUserListComponent implements OnInit {
  @Input() users: UserChatRoom[];

  constructor() {}

  ngOnInit(): void {}
}
