import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Friendship, User } from '../../../models';
import { FriendService } from '../../../services';

@Component({
  selector: 'app-friend-requests',
  templateUrl: './friend-requests.component.html',
  styleUrls: ['./friend-requests.component.scss'],
})
export class FriendRequestsComponent implements OnInit, OnDestroy {
  constructor(private readonly friendService: FriendService) {}
  private unsubscribeAll$ = new Subject<void>();

  @Input() me!: User;
  @Output() requests = new EventEmitter<number>();
  friendsRequests?: Friendship[];

  newRequest(value: number) {
    this.requests.emit(value);
  }

  ngOnInit(): void {
    this.friendService
      .getPendingInvitations(this.me.id)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (data) => {
          this.friendsRequests = data;
          this.newRequest(this.friendsRequests.length);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  ngOnDestroy(): void {
    this.unsubscribeAll$.next();
  }
}
