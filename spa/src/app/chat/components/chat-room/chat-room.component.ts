import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { Room } from '../../models';
import { ChatService } from '../../services';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
})
export class ChatRoomComponent implements OnInit, OnDestroy, AfterViewInit {
  private unsubscribeAll$ = new Subject<void>();
  @ViewChild('messages') private messagesScroller: ElementRef;
  room: Room;

  message: string = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly chatService: ChatService
  ) {}

  ngAfterViewInit(): void {
    if (this.messagesScroller) {
      this.scrollToBottom();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next();
    if (this.room) {
      this.chatService.leaveRoom(this.room.id);
    }
  }

  ngOnInit(): void {
    this.route.data.pipe(takeUntil(this.unsubscribeAll$)).subscribe({
      next: (data) => {
        this.room = data['room'];
        this.chatService.joinRoom(this.room.id);
      },
    });

    this.chatService
      .getNewMessage()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((msg) => {
        this.room.messages.push(msg);
        this.scrollToBottom();
      });
  }

  sendMessage(event: any): void {
    this.chatService.sendMessage({
      roomId: this.room.id,
      content: this.message,
    });
    this.message = '';
  }

  scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.messagesScroller.nativeElement.scrollTop =
          this.messagesScroller.nativeElement.scrollHeight;
      }, 1);
    } catch {}
  }
}
