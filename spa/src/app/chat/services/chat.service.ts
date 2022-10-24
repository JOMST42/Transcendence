import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

import { ToastService } from '../../core/services';
import { Room } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private socket: Socket,
    private readonly toastService: ToastService
  ) {}

  getMessage(): Observable<string> {
    return this.socket.fromEvent('message');
  }

  getRooms(): Observable<Room[]> {
    return this.socket.fromEvent<Room[]>('rooms');
  }

  createRoom(room: Room): void {
    this.socket.emit('createRoom', room);
    this.toastService.showSuccess('Success', `Room ${room.name} created`);
  }

  joinRoom(roomId: number): void {
    this.socket.emit('joinRoom', roomId);
  }
}
