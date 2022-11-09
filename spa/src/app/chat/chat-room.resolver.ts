import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Room } from './models';
import { ChatService } from './services';

@Injectable({
  providedIn: 'root',
})
export class ChatRoomResolver implements Resolve<Room> {
  constructor(private readonly chatService: ChatService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Room> {
    return this.chatService.getChatRoom(route.paramMap.get('id'));
  }
}
