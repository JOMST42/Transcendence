import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { ChatMessage } from '../../models';
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
  message: string;

  constructor(private readonly chatService: ChatService) {}

  ngOnDestroy(): void {
    this.chatService.leaveRoom(this.roomId);
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
    this.chatService.joinRoom(this.roomId);
  }

  sendMessage(): void {
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
}
