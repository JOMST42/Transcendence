import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Room } from '../../models';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
})
export class ChatRoomComponent implements OnInit, OnDestroy {
  private unsubscribeAll$ = new Subject<void>();
  room: Room;
  messages: any[];

  constructor(private readonly route: ActivatedRoute) {}

  ngOnDestroy(): void {
    this.unsubscribeAll$.next();
  }

  ngOnInit(): void {
    this.route.data.pipe(takeUntil(this.unsubscribeAll$)).subscribe({
      next: (data) => {
        this.room = data['room'];
        console.log(this.room);
      },
    });
  }

  sendMessage(event) {}
}
