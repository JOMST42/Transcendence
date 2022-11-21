import { Component, Input, OnInit } from '@angular/core';
import { ChatMessage } from '../../models';

@Component({
  selector: 'app-chat-message-list',
  templateUrl: './chat-message-list.component.html',
  styleUrls: ['./chat-message-list.component.scss'],
})
export class ChatMessageListComponent implements OnInit {
  @Input() messages: ChatMessage[];
  message: string;

  constructor() {}

  ngOnInit(): void {}
}
