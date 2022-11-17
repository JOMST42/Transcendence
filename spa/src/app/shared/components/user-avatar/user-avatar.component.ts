import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../user/models';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
})
export class UserAvatarComponent implements OnInit {
  constructor() {}

  @Input() avatarUrl: string;
  @Input() user!: User;

  colorStateAvatar(state: string): boolean {
    if (state === 'online') {
      return true;
    } else if (state === 'offline') {
      return false;
    } else if (state === 'gaming') {
      return true;
    }
    return false;
  }

  ngOnInit(): void {
    //colorStateAvatar()
  }
}
