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
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, take, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/services';
import { User } from '../../../user/models';

import { ChatMessage, UserChatRoom } from '../../models';
import { ChatService } from '../../services';
import { PasswordDialogComponent } from '../password-dialog/password-dialog.component';

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
  @Input() user: UserChatRoom;
  @Input() blockedUsers: User[];
  @Output() onLeaveChannel = new EventEmitter<string>();
  me: User;
  message: string;

  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
    private readonly dialogService: DialogService
  ) {}

  ngOnDestroy(): void {
    this.unsubscribeAll$.next();
  }

  ngAfterViewInit(): void {
    if (this.messagesScroller) {
      this.scrollToBottom();
    }
    this.authService
      .getCurrentUser()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (user) => {
          this.me = user;
        },
      });
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

  changePassword(roomId: string): void {
    const ref = this.dialogService.open(PasswordDialogComponent, {
      header: 'Enter password',
      width: '50%',
    });

    ref.onClose.pipe(take(1)).subscribe({
      next: (data: { password: string }) => {
        if (data) {
          this.chatService
            .changePassword(roomId, data.password)
            .subscribe({ next: () => {} });
        }
      },
    });
  }
}
