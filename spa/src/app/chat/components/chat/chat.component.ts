import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, Subscription, take, takeUntil, tap } from 'rxjs';

import { AuthService, ToastService } from '../../../core/services';
import { User } from '../../../user/models';
import { Room } from '../../models';
import { ChatService } from '../../services';
import { PasswordDialogComponent } from '../password-dialog/password-dialog.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  private unsubscribeAll$ = new Subject<void>();
  private newUser$: Subscription = null;
  rooms: Room[];
  selectedChannel: Room | null = null;
  me: User;

  constructor(
    private readonly chatService: ChatService,
    private readonly route: ActivatedRoute,
    private readonly toastService: ToastService,
    private readonly dialogService: DialogService,
    private readonly authService: AuthService
  ) {}

  ngOnDestroy(): void {
    this.leaveChannel();
    this.unsubscribeAll$.next();
  }

  ngOnInit(): void {
    this.route.data.pipe(takeUntil(this.unsubscribeAll$)).subscribe((data) => {
      this.rooms = data['rooms'];
    });
    this.authService
      .getCurrentUser()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((user) => (this.me = user));
  }

  onChannelSelect(channel: Room): void {
    if (!channel) {
      this.selectedChannel = null;
      return;
    }
    if (
      channel.isProtected &&
      !channel.users.find((user) => {
        return this.me.id === user.userId;
      })
    ) {
      const ref = this.dialogService.open(PasswordDialogComponent, {
        header: 'Enter password',
        width: '50%',
      });

      ref.onClose.pipe(take(1)).subscribe({
        next: (data: { password: string }) => {
          if (data) {
            this.selectChannel(channel, data.password);
          }
        },
      });
    } else {
      this.selectChannel(channel);
    }
  }

  selectChannel(channel: Room, password?: string): void {
    if (password) {
      this.chatService
        .addUserToRoom(this.me.id, channel.id, password)
        .pipe(take(1))
        .subscribe({
          next: (data) => {
            this.chatService
              .getChatRoom(channel.id)
              .pipe(
                take(1),
                tap((data) => {
                  this.leaveChannel();
                  this.chatService.joinRoom(data.id);
                  if (this.newUser$) {
                    this.newUser$.unsubscribe();
                  }
                  this.newUser$ = this.chatService.getNewUser().subscribe({
                    next: (user) => {
                      this.selectedChannel.users.push(user);
                    },
                  });
                })
              )
              .subscribe({
                next: (data) => {
                  data.messages.reverse();
                  this.selectedChannel = data;
                },
              });
          },
        });
    } else {
      this.chatService
        .getChatRoom(channel.id)
        .pipe(
          take(1),
          tap((data) => {
            this.leaveChannel();
            this.chatService.joinRoom(data.id);
            if (this.newUser$) {
              this.newUser$.unsubscribe();
            }
            this.newUser$ = this.chatService.getNewUser().subscribe({
              next: (user) => {
                this.selectedChannel.users.push(user);
              },
            });
          })
        )
        .subscribe({
          next: (data) => {
            data.messages.reverse();
            this.selectedChannel = data;
          },
        });
    }
  }

  leaveChannel(): void {
    if (this.selectedChannel) {
      this.chatService.leaveRoom(this.selectedChannel.id);
    }
  }
}
