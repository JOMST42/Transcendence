import { Component, Input, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { ToastService } from '../../../../core/services';
import { UpdateFriendsDto, User } from '../../../models';
import { FriendService } from '../../../services';

@Component({
  selector: 'app-friend-btn',
  templateUrl: './friend-btn.component.html',
  styleUrls: ['./friend-btn.component.scss'],
})
export class FriendBtnComponent implements OnInit {
  constructor(
    private readonly friendService: FriendService,
    private readonly toastService: ToastService
  ) {}

  @Input() user!: User;
  @Input() me!: User;
  @Input() userIsMe!: boolean;

  state: 'ADD' | 'ACCEPT' | 'REMOVE' | 'DISABLE' = 'DISABLE';

  async initButton() {
    await this.friendService
      .checkFriendship(this.user.id, this.me.id)
      .then((data) => {
        if (data.accepted === false) {
          if (data.requesterId == this.me.id) {
            this.state = 'DISABLE';
          }
          if (data.adresseeId == this.me.id) {
            this.state = 'ACCEPT';
            this.toastService.showInfo(
              'Hey !',
              'You received an invitation from ' + this.user.displayName
            );
          }
        } else {
          this.state = 'REMOVE';
        }
      })
      .catch((data) => {
        console.log('catch');
        this.state = 'ADD';
      });
  }

  friendButton(state: 'ADD' | 'ACCEPT' | 'REMOVE' | 'DISABLE') {
    switch (state) {
      case 'ADD': {
        this.friendService.addFriend(this.user.id, this.me.id);
        break;
      }
      case 'ACCEPT': {
        this.acceptNewFriend();
        break;
      }
      case 'REMOVE': {
        this.removeFriend();
        break;
      }
      case 'DISABLE': {
        break;
      }
    }
  }

  acceptNewFriend() {
    this.friendService
      .updateFriendship(
        { adresseeId: this.user.id, requesterId: this.me.id },
        this.me.id
      )
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          console.log(data);
        },
      });
  }

  removeFriend() {
    this.friendService
      .removeFriendship(
        { adresseeId: this.user.id, requesterId: this.me.id },
        this.me.id
      )
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.toastService.showWarn(
            'Friend removed !',
            'You are no longer friend with ' + this.user.displayName
          );
          console.log(data);
        },
      });
  }
  async ngOnInit(): Promise<void> {
    await this.initButton();
  }
}
