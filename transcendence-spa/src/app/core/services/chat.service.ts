import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, of } from 'rxjs';
import { Room } from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: Socket) {}

  sendMessage() {}

  getMessage(): Observable<string> {
    return this.socket.fromEvent('message');
  }

  getRooms(): Observable<Room[]> {
    return this.socket.fromEvent<Room[]>('rooms');
  }

  createRoom() {
    const room: Room = {
      name: 'test',
      users: [{ id: 1 }],
    };

    this.socket.emit('createRoom', room);
    0;
  }
}
