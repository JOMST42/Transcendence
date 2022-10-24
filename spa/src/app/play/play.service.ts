import { Injectable } from '@angular/core';
// import { io, Socket } from 'socket.io-client';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { PongSocket } from '../app.module';

@Injectable({
  providedIn: 'root'
})
export class PlayService {

  constructor(private socket: PongSocket) { }

	// public connect(address: string) : Socket {
	// 	this.socket?.disconnect();
	// 	this.socket = io("http://localhost:3000/pong");
	// 	return this.socket;
	// }

	public listen(eventName: string): Observable<any> {
		return this.socket.fromEvent(eventName);
	}

	public emit(eventName: string, data: any): Promise<any> {
		// return this.socket.emit(eventName, data);

		return new Promise((resolve, reject) => {
			this.socket.emit(eventName, data, (response: any) => {
					if (!response) {
							reject(undefined);
					} else {
							resolve(response);
					}
			});
		});
	}

	public listenGameStart(): Promise<any> {
		return this.socket.fromOneTimeEvent("game-start");
	}

	public listenGameUpdate(): Observable<any> {
		return this.socket.fromEvent("game-update");
	}

	public listenGameEnd() {}

}
