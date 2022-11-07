import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ChatMessage, Room } from '../../models';
import { ChatService } from '../../services';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
})
export class ChatRoomComponent implements OnInit, OnDestroy {
  private unsubscribeAll$ = new Subject<void>();
  room: Room;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly chatService: ChatService
  ) {}

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

    this.chatService
      .getNewMessage()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((msg) => {
        this.room.messages.push(msg);
        console.log(msg);
      });
  }

  sendMessage(event: any): void {
    this.chatService.sendMessage({
      roomId: this.room.id,
      content: 'this is a message',
    });
  }
}
