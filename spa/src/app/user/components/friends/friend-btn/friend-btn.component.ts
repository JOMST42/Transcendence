import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { take } from 'rxjs';
import { ToastService } from '../../../../core/services';
import { User } from '../../../models';
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
          if (data.requesterId === this.me.id) {
            this.state = 'DISABLE';
            console.log(this.state + ' dans init button');
          }
          if (data.adresseeId === this.me.id) {
            this.state = 'ACCEPT';
            console.log(this.state + ' dans init button');
          }
        } else {
          this.state = 'REMOVE';
          console.log(this.state + ' dans init button');
        }
      })
      .catch((data) => {
        console.log('catch init button');
        this.state = 'ADD';
      });
  }

  friendButton(state: ButtonState) {
    switch (state) {
      case 'ADD': {
        this.friendService.addFriend(this.user.id, this.me.id);
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
          this.state = 'ADD';
        },
      });
  }
  async ngOnInit(): Promise<void> {
    await this.initButton();
  }
}
