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

  getChatRoomList(): Observable<Room[]> {
    return this.baseApiService.getMany<Room>('/chatrooms');
  }

  getNewRoom(): Observable<Room> {
    return this.socket.fromEvent<Room>('newRoom');
  }

  createRoom(room: Room): Observable<Room> {
    return this.baseApiService.postOne<Room>('/chatrooms', room);
  }

  joinRoom(roomId: number): void {
    this.socket.emit('joinRoom', roomId);
  }

  leaveRoom(roomId: number): void {
    this.socket.emit('leaveRoom', roomId);
  }

  sendMessage(message: ChatMessage, callback?: any): void {
    this.socket.emit('sendMessage', message, (data: any) => {
      if (callback) {
        callback(data);
      }
    });
  }

  getNewMessage(): Observable<ChatMessage> {
    return this.socket.fromEvent<ChatMessage>('newMessage');
  }

  getChatRoom(id: string): Observable<Room> {
    return this.baseApiService.getOne(`/chatrooms/${id}`);
  }
}
