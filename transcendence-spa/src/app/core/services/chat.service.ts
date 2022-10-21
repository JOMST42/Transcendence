import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, of } from 'rxjs';
import { Room } from '../../shared/models';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private socket: Socket,
    private readonly toastService: ToastService
  ) {}

  sendMessage() {}

  getMessage(): Observable<string> {
    return this.socket.fromEvent('message');
  }

  getRooms(): Observable<Room[]> {
    return this.socket.fromEvent<Room[]>('rooms');
  }

  createRoom(room: Room) {
    this.socket.emit('createRoom', room);
    this.toastService.showSuccess('Success', `Room ${room.name} created`);
  }
}
