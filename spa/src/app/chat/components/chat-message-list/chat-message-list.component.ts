import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-message-list',
  templateUrl: './chat-message-list.component.html',
  styleUrls: ['./chat-message-list.component.scss'],
})
export class ChatMessageListComponent implements OnInit {
  message: string;

  constructor() {}

  ngOnInit(): void {}
}
