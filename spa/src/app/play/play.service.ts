import { Injectable } from '@angular/core';
// import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { PongSocket } from '../core/core.module';

@Injectable({
  providedIn: 'root',
})
export class PlayService {
  constructor(private socket: PongSocket) {}

  public reconnect() {
    // this.socket?.disconnect();
    // this.socket = io("http://10.12.2.11:3000/pong");
    // return this.socket;
    this.socket?.disconnect();
    this.socket.connect();
  }

  public listen(eventName: string): Observable<any> {
    return this.socket.fromEvent(eventName);
  }

  public emit(eventName: string, data: any): Promise<any> {
    // return this.socket.emit(eventName, data);
    return new Promise((resolve, reject) => {
      this.socket.emit(eventName, data, (response: any) => {
        if (!response || response.code !== 0) {
          reject(response);
        } else {
          resolve(response);
        }
      });
    });
  }

  public listenGameWaiting(): Observable<any> {
    return this.socket.fromEvent('game-waiting');
  }

  public listenGameStart(): Promise<any> {
    return this.socket.fromOneTimeEvent('game-start');
  }

  public listenGameUpdate(): Observable<any> {
    return this.socket.fromEvent('game-update');
  }

  public listenGameEnd() {}
}
