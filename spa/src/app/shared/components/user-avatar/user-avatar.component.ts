import { Component, Input, OnInit } from '@angular/core';
import { StateKey } from '@angular/platform-browser';
import { User, UserStatus } from '../../../user/models';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
})
export class UserAvatarComponent implements OnInit {
  constructor() {}

  @Input() avatarUrl: string;
  @Input() user!: User;

  isOffline(): boolean {
    if (this.user.status === UserStatus.OFFLINE) {
      return true;
    }
    return false;
  }

  isGaming(): boolean {
    if (!this.isOffline()) {
      if (
        this.user.status === UserStatus.IN_GAME ||
        this.user.status === UserStatus.SPECTATING
      ) {
        return true;
      }
    }
    return false;
  }

  ngOnInit(): void {}
}
