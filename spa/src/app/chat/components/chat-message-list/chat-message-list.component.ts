import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';

import { ChatMessage, Room } from '../../models';
import { ChatService } from '../../services';

@Component({
  selector: 'app-chat-message-list',
  templateUrl: './chat-message-list.component.html',
  styleUrls: ['./chat-message-list.component.scss'],
})
export class ChatMessageListComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  private unsubscribeAll$ = new Subject<void>();
  @ViewChild('messages') private messagesScroller: ElementRef;
  @Input() chatMessages: ChatMessage[];
  @Input() roomId: string;
  @Output() onLeaveChannel = new EventEmitter<string>();
  message: string;

  constructor(private readonly chatService: ChatService) {}

  ngOnDestroy(): void {
    this.unsubscribeAll$.next();
  }

  ngAfterViewInit(): void {
    if (this.messagesScroller) {
      this.scrollToBottom();
    }
  }

  ngOnInit(): void {
    this.chatService
      .getNewMessage()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((msg) => {
        this.chatMessages.unshift(msg);
        this.scrollToBottom();
      });
  }

  sendMessage(event: any): void {
    if (event && event.key !== 'Enter') {
      return;
    }
    this.chatService.sendMessage({
      roomId: this.roomId,
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

  leaveChannel(roomId: string): void {
    this.chatService
      .userLeaveRoom(roomId)
      .pipe(take(1))
      .subscribe(() => {
        this.onLeaveChannel.emit(roomId);
      });
  }
}
