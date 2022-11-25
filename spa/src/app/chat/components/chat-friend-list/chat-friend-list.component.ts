import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../user/models';

@Component({
  selector: 'app-chat-friend-list',
  templateUrl: './chat-friend-list.component.html',
  styleUrls: ['./chat-friend-list.component.scss'],
})
export class ChatFriendListComponent implements OnInit {
  @Input() friends: User[];

  constructor() {}

  ngOnInit(): void {}
}
