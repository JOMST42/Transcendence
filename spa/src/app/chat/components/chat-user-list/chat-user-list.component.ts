import { Component, Input, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { take } from 'rxjs';
import { UserService } from '../../../user/services';

import { UserChatRoom } from '../../models';
import { ChatService } from '../../services';
import { UserInviteComponent } from '../user-invite/user-invite.component';

@Component({
  selector: 'app-chat-user-list',
  templateUrl: './chat-user-list.component.html',
  styleUrls: ['./chat-user-list.component.scss'],
})
export class ChatUserListComponent implements OnInit {
  @Input() users: UserChatRoom[];
  @Input() roomId: string;

  constructor(
    private readonly dialogService: DialogService,
    private readonly chatService: ChatService,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {}

  inviteUser(): void {
    this.userService
      .getUsers()
      .pipe(take(1))
      .subscribe({
        next: (users) => {
          const ref = this.dialogService.open(UserInviteComponent, {
            header: 'Invite user',
            width: '50%',
            height: '50%',
            data: users.filter((user) => {
              return !this.users.find((u) => {
                return u.userId === user.id;
              });
            }),
          });

          ref.onClose.pipe(take(1)).subscribe((userId: number) => {
            if (userId) {
              this.chatService.inviteUser(userId, this.roomId);
            }
          });
        },
      });
  }
}
