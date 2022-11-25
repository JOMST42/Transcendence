import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../user/models';

@Component({
  selector: 'app-chat-friend',
  templateUrl: './chat-friend.component.html',
  styleUrls: ['./chat-friend.component.scss'],
})
export class ChatFriendComponent implements OnInit {
  @Input() friend: User;

  constructor() {}

  ngOnInit(): void {}
}
