import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Friendship, User } from '../../../models';
import { UserService } from '../../../services';

@Component({
  selector: 'app-friend-card',
  templateUrl: './friend-card.component.html',
  styleUrls: ['./friend-card.component.scss'],
})
export class FriendCardComponent implements OnInit {
  user!: User;
  @Input() userIsMe!: boolean;
  @Input() me: User;
  @Input() friends: Friendship[];
  @Input() friend: User;
  @Input() friendship: Friendship;
  display: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly userService: UserService
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

  async getFriendToUser(friends: Friendship): Promise<User> {
    let friendId: number;
    if (friends.adresseeId === this.me.id) {
      friendId = friends.requesterId;
    } else if (friends.requesterId === this.me.id) {
      friendId = friends.adresseeId;
    }
    return new Promise((resolve, reject) => {
      this.userService.getUserById(friendId).subscribe({
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
    const user = await this.getFriendToUser(friends)
      .then((data) => {
        this.user = data;
        console.log(this.user);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  ngOnInit(): void {
    this.friendToUser(this.friendship);
  }
}
