import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Friendship, User } from '../../../models';
import { FriendService, UserService } from '../../../services';

@Component({
  selector: 'app-friend-requests',
  templateUrl: './friend-requests.component.html',
  styleUrls: ['./friend-requests.component.scss'],
})
export class FriendRequestsComponent implements OnInit {
  constructor(private readonly friendService: FriendService) {}

  @Input() me!: User;

  friendsRequests?: Friendship[];

  ngOnInit(): void {
    this.friendService.getPendingInvitations(this.me.id).subscribe({
      next: (data) => {
        this.friendsRequests = data;
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
