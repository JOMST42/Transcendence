import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ChatSocket } from '../../core/core.module';
import { ToastService } from '../../core/services';
import { ChatMessage, Room } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private socket: ChatSocket,
    private readonly toastService: ToastService
  ) {}

  getRooms(): Observable<Room[]> {
    return this.socket.fromEvent<Room[]>('rooms');
  }

  createRoom(room: Room): void {
    this.socket.emit('createRoom', room, (newRoom: Room) => {
      this.toastService.showSuccess('Success', `Created room ${newRoom.name}`);
    });
  }

  joinRoom(roomId: number): void {
    this.socket.emit('joinRoom', roomId);
  }

  sendMessage(message: ChatMessage): void {
    this.socket.emit('sendMessage', message);
  }
}
