import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { Friendship, User } from '../../../models';
import { FriendService, UserService } from '../../../services';

@Component({
  selector: 'app-friend-card',
  templateUrl: './friend-card.component.html',
  styleUrls: ['./friend-card.component.scss'],
})
export class FriendCardComponent implements OnInit {
  user!: User;
  @Input() userIsMe!: boolean;
  @Input() me: User;
  myFriendId!: number;
  @Input() friendship: Friendship;
  display: boolean = false;
  friendState: boolean = true;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly userService: UserService,
    private readonly friendService: FriendService
  ) {}

  showDialog() {
    this.display = true;
  }

  closeDialog() {
    this.display = false;
  }

  resetPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['./'], {
      relativeTo: this.route,
    });
  }

  async friendshipBlockedOrNotAccepted(userId: number, friends: Friendship) {
    let friendId: number;
    if (friends.adresseeId === this.me.id) {
      friendId = friends.requesterId;
    } else if (friends.requesterId === this.me.id) {
      friendId = friends.adresseeId;
    }
    this.friendService
      .getFriend(friendId, userId)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          if (data) {
            if (
              data.adresseeBlocker === true ||
              data.requesterBlocker === true
            ) {
              this.friendState = false;
            } else if (data.accepted === false) {
              this.friendState = false;
            }
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  async getFriendToUser(friends: Friendship): Promise<User> {
    if (friends.adresseeId === this.me.id) {
      this.myFriendId = friends.requesterId;
    } else if (friends.requesterId === this.me.id) {
      this.myFriendId = friends.adresseeId;
    }
    return new Promise((resolve, reject) => {
      this.userService
        .getUserById(this.myFriendId)
        .pipe(take(1))
        .subscribe({
          next: (data) => {
            if (data) {
              resolve(data);
            }
            reject(null);
          },
        });
    });
  }

  async friendToUser(friends: Friendship) {
    await this.getFriendToUser(friends)
      .then((data) => {
        this.user = data;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  ngOnInit(): void {
    this.friendToUser(this.friendship);
    this.friendshipBlockedOrNotAccepted(this.me.id, this.friendship);
  }
}
