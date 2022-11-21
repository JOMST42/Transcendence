import { Component, Input, OnInit } from '@angular/core';
import { Friendship, User } from '../../../models';
import { FriendService, UserService } from '../../../services';

@Component({
  selector: 'app-friend-request-card',
  templateUrl: './friend-request-card.component.html',
  styleUrls: ['./friend-request-card.component.scss'],
})
export class FriendRequestCardComponent implements OnInit {
  @Input() friendship: Friendship;
  @Input() me!: User;
  myFriend!: User;

  constructor(private readonly userService: UserService) {}

  async getFriendToUser(friend: Friendship): Promise<User> {
    return new Promise((resolve, reject) => {
      this.userService.getUserById(friend.requesterId).subscribe({
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
        this.myFriend = data;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  ngOnInit(): void {
    this.friendToUser(this.friendship);
  }
}
