import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastService } from '../../../core/services';
import { Room, UserChatRoom } from '../../models';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
})
export class UserDialogComponent implements OnInit {
  role: 'ADMIN' | 'USER';
  roles = [
    { name: 'Admin', value: 'ADMIN' },
    { name: 'User', value: 'USER' },
  ];
  user: UserChatRoom;
  me: UserChatRoom;
  isOwner: boolean;

  constructor(
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
    private readonly toastService: ToastService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.config.data['user'];
    this.isOwner = this.config.data['isOwner'];
    this.me = this.config.data['me'];
  }

  close(): void {
    if (!this.role) {
      this.toastService.showError('Error', 'Choose a role');
      return;
    }

    this.ref.close({
      role: this.role,
    });
  }

  ban(): void {
    this.ref.close({
      ban: new Date(Date.now() + 1 * 60000),
    });
  }

  mute(): void {
    this.ref.close({
      mute: new Date(Date.now() + 1 * 60000),
    });
  }

  cancel(): void {
    this.ref.close();
  }

  viewProfile(): void {
    this.router.navigate(['users', this.user.userId]);
    this.ref.close();
  }

  emitRoom(room: Room): void {
    this.ref.close({
      room,
    });
  }
}
