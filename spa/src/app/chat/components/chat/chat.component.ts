import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';

import { Room } from '../../models';
import { ChatService } from '../../services';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  rooms: Room[];

  constructor(private readonly chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService
      .getRooms()
      .pipe(
        map((rooms: Room[]) => {
          return rooms.sort((a, b) => a.id - b.id);
        })
      )
      .subscribe({ next: (rooms) => (this.rooms = rooms) });
  }

  createRoom(): void {
    this.chatService.createRoom({ name: 'test' });
  }
}
