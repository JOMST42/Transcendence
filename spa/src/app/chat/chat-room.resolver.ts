import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';

import { Room } from './models';
import { ChatService } from './services';

@Injectable({
  providedIn: 'root',
})
export class ChatRoomResolver implements Resolve<Room[]> {
  constructor(private readonly chatService: ChatService) {}

  resolve(): Observable<Room[]> {
    return this.chatService.getChatRooms();
  }
}
