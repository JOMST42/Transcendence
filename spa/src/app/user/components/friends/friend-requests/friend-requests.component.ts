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
  @Output() requests = new EventEmitter<number>();
  friendsRequests?: Friendship[];

  newRequest(value: number) {
    this.requests.emit(value);
  }

  ngOnInit(): void {
    this.friendService.getPendingInvitations(this.me.id).subscribe({
      next: (data) => {
        this.friendsRequests = data;
        this.newRequest(this.friendsRequests.length);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
