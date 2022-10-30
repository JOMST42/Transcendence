import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ChatSocket } from '../../core/core.module';
import { BaseApiService } from '../../core/services';
import { ChatMessage, Room } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private socket: ChatSocket,
    private readonly baseApiService: BaseApiService
  ) {}

  getChatRooms(): Observable<Room[]> {
    return this.baseApiService.getMany<Room>('/chat-rooms');
  }

  getNewRoom(): Observable<Room> {
    return this.socket.fromEvent<Room>('newRoom');
  }

  createRoom(room: Room): Observable<Room> {
    return this.baseApiService.postOne<Room>('/chat-rooms', room);
  }

  joinRoom(roomId: number): void {
    this.socket.emit('joinRoom', roomId);
  }

  sendMessage(message: ChatMessage): void {
    this.socket.emit('sendMessage', message);
  }

  getNewMessage(): Observable<ChatMessage> {
    return this.socket.fromEvent<ChatMessage>('newMessage');
  }
}
