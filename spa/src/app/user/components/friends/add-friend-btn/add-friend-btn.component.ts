import { Component, Input, OnInit } from '@angular/core';
import { observable, Subject, take } from 'rxjs';
import { ToastService } from '../../../../core/services';
import { UpdateFriendsDto, User } from '../../../models';
import { FriendService } from '../../../services';

@Component({
  selector: 'app-add-friend-btn',
  templateUrl: './add-friend-btn.component.html',
  styleUrls: ['./add-friend-btn.component.scss'],
})
export class AddFriendBtnComponent implements OnInit {
  constructor(
    private readonly friendService: FriendService,
    private readonly toastService: ToastService
  ) {}

  @Input() user!: User;
  @Input() me!: User;
  @Input() userIsMe!: boolean;

  state: 'ADD' | 'ACCEPT' | 'REMOVE' | 'DISABLE' = 'DISABLE';

  /*Check if there is a pending invitation (accepted = false)
  Dans ce cas l'adressee a un bnt accept et
  le requester à le btn add mais en grisé*/
  friendshipPending: boolean;

  async initButton() {
    await this.checkFriendship()
      .then((data) => {
        console.log(data.accepted);
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
        this.addFriend();
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

  /*Check if there is a relation created between 2 users*/
  async checkFriendship(): Promise<UpdateFriendsDto> {
    return new Promise((resolve, reject) => {
      this.friendService
        .getFriend({ adresseeId: this.user.id }, this.me.id)
        .pipe(take(1))
        .subscribe({
          next: (data) => {
            if (data) {
              resolve(data);
              console.log(data);
            }
            console.log(data);
            reject(null);
          },
        });
    });
  }

  async addFriend() {
    console.log(this.user.id + ' adressee ID');
    console.log(this.me.id + ' me ID');
    const friend = await this.checkFriendship()
      .then((data) => {
        this.toastService.showInfo(
          'Wait !',
          "You've already send an invitation..."
        );
      })
      .catch((err) => {
        this.friendService
          .createFriendship({ adresseeId: this.user.id }, this.me.id)
          .pipe(take(1))
          .subscribe({
            next: (data) => {
              console.log(data);
            },
          });
        this.toastService.showInfo(' !', 'Friend invitation send');
      });
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
