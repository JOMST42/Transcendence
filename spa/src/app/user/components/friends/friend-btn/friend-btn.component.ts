import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { take } from 'rxjs';
import { ToastService } from '../../../../core/services';
import { Friendship, User } from '../../../models';
import { FriendService } from '../../../services';

type ButtonState = 'ADD' | 'ACCEPT' | 'REMOVE' | 'DISABLE';
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
  state: ButtonState = 'DISABLE';
  @Output() stateChange = new EventEmitter<ButtonState>();

  stateChanged(state: ButtonState) {
    this.stateChange.emit();
  }

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

  friendButton(state: ButtonState) {
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
      .updateFriendship(this.user.id, this.me.id)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          console.log(data);
          this.state = 'REMOVE';
        },
      });
  }

  removeFriend() {
    this.friendService
      .removeFriendship(this.user.id, this.me.id)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.toastService.showWarn(
            'Friend removed !',
            'You are no longer friend with ' + this.user.displayName
          );
          console.log(data);
          this.state = 'ADD';
        },
      });
  }
  async ngOnInit(): Promise<void> {
    await this.initButton();
  }
}
