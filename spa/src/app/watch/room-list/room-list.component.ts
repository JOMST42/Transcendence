import { Component, OnInit } from '@angular/core';
import { Socket } from 'socket.io-client';
import { Response } from '../../play/interfaces';
import {
  trigger,
  state,
  style,
  animate,
  transition,
	query,
	stagger,
	keyframes,
  // ...
} from '@angular/animations';
import { PlayService } from '../../play/play.service';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss'],
	animations: [
		trigger('stagger', [
      transition('* => *', [ // each time the binding value changes
				query(':enter', style({ opacity: 0 }), { optional: true }),
				query(':enter', stagger('50ms', [
          animate('200ms ease-in', keyframes([
            style({ opacity: 0, transform: 'translateY(-50%)', offset: 0 }),
            style({ opacity: .5, transform: 'translateY(-10px) scale(1.1)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
          ]))]), { optional: true }),
				// query(':leave', stagger('50ms', [
				// 	animate('100ms ease-out', keyframes([
				// 		style({ opacity: 1, transform: 'scale(1.1)', offset: 0 }),
				// 		style({ opacity: .5, transform: 'scale(.5)', offset: 0.3 }),
				// 		style({ opacity: 0, transform: 'scale(0)', offset: 1 }),
				// 	]))]), { optional: true })
			])
    ])
	],
})
export class RoomListComponent implements OnInit {

	// RoomList: string = "";
	roomList: {id:string, name:string}[] = [];
	selectedRoom?: {id:string, name:string};

  constructor(private server: PlayService) { }

  ngOnInit(): void {
		
  }

	onSelect(room: {id:string, name:string}): void {
    this.server.emit('join-room', room.id);
  }

	async getRooms(){
		this.server.emit('get-rooms', {}).then((data:Response) => 
			data.code === 0 ? this.fillRooms(data.payload!) : null
			);
	}

	async fillRooms(rooms:string[]) {
		this.roomList = [];

		for (let i = 0; i < rooms.length; i++) {
			this.roomList.push({id:rooms[i], name:'placeholder'});
		}
	}

}
