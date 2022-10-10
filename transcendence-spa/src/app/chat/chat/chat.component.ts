import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../core/services';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  msg = this.chatService.getMessage();

  constructor(private readonly chatService: ChatService) {}

  ngOnInit(): void {}
}
