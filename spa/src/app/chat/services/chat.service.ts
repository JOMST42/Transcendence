import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ChatSocket } from '../../core/core.module';
import { ChatMessage, Room } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: ChatSocket) {}

  getRooms(): Observable<Room[]> {
    return this.socket.fromEvent<Room[]>('rooms');
  }

  createRoom(room: Room): void {
    this.socket.emit('createRoom', room);
  }

  joinRoom(roomId: number): void {
    this.socket.emit('joinRoom', roomId);
  }

  sendMessage(message: ChatMessage): void {
    this.socket.emit('sendMessage', message);
  }
}
