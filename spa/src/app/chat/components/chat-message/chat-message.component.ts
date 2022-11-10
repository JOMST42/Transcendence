import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/services';
import { User } from '../../../user/models';
import { ChatMessage } from '../../models';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent implements OnInit, OnDestroy {
  private unsubscribeAll$ = new Subject<void>();

  @Input() message: ChatMessage;
  user: User;

  constructor(authService: AuthService) {
    authService
      .getCurrentUser()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((user) => (this.user = user));
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next();
  }

  ngOnInit(): void {}
}
