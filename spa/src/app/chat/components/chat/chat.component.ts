import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, Subscription, take, takeUntil, tap } from 'rxjs';

import { AuthService, ToastService } from '../../../core/services';
import { User } from '../../../user/models';
import { Room, UserChatRoom } from '../../models';
import { ChatService } from '../../services';
import { PasswordDialogComponent } from '../password-dialog/password-dialog.component';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  private unsubscribeAll$ = new Subject<void>();
  rooms: Room[];
  selectedChannel: Room | null = null;
  blockedUsers: User[];
  me: User;

  constructor(
    private readonly chatService: ChatService,
    private readonly route: ActivatedRoute,
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
      this.blockedUsers = data['blocked'];
    });
    this.authService
      .getCurrentUser()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((user) => (this.me = user));
    this.chatService
      .getNewUser()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (user) => {
          if (this.selectedChannel) {
            this.selectedChannel.users.push(user);
          }
        },
      });
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

  userLeaveChannel(roomId: string): void {
    const room = this.rooms.find((r) => {
      return r.id === roomId;
    });

    if (!room) {
      return;
    }

    if (room.visibility === 'PRIVATE' || room.users.length === 0) {
      const idx = this.rooms.indexOf(room);
      if (idx < 0) {
        return;
      }
      this.rooms.splice(idx, 1);
    }
    this.selectedChannel = undefined;
  }

  userListClick(user: UserChatRoom): void {
    if (user.userId === this.me.id) {
      return;
    }

    const userChat = this.selectedChannel.users.find((u) => {
      return u.userId === this.me.id;
    });

    const ref = this.dialogService.open(UserDialogComponent, {
      header: user.user.displayName,
      width: '50%',
      height: '500px',
      data: { user: user, isOwner: userChat.isOwner, me: userChat },
    });

    ref.onClose.pipe(take(1)).subscribe({
      next: (data: { role?: 'ADMIN' | 'USER'; ban?: Date; mute?: Date }) => {
        if (data) {
          if (data.role) {
            this.chatService
              .changeRole(user.userId, user.roomId, data.role)
              .pipe(take(1))
              .subscribe({
                next: (user) => {
                  const toUpdate = this.selectedChannel.users.find((u) => {
                    return u.userId === user.userId;
                  });

                  if (toUpdate) {
                    toUpdate.role = data.role;
                  }
                },
              });
          }
          if (data.ban) {
            this.chatService.banUser(user.userId, user.roomId, data.ban);
          }
          if (data.mute) {
            this.chatService.muteUser(user.userId, user.roomId, data.mute);
          }
        }
      },
    });
  }

  findMe(): UserChatRoom {
    return this.selectedChannel?.users.find((user) => {
      return user.userId === this.me.id;
    });
  }
}
