import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../../../core/services';
import { User } from '../../../user/models';
import { ChatMessage } from '../../models';
import { checkBlocked } from '../../utils';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent implements OnInit, OnDestroy {
  private unsubscribeAll$ = new Subject<void>();

  @Input() message: ChatMessage;
  @Input() blockedUsers: User[];
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

  checkMessage(): string {
    return checkBlocked(this.message, this.blockedUsers);
  }
}
