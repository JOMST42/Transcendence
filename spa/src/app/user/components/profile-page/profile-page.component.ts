import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { User } from '../../models';
import { FriendService, UserService } from '../../services';
import { AuthService, ToastService } from '../../../core/services';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  private unsubscribeAll$ = new Subject<void>();

  user!: User;
  me!: User;
  displayName!: string;

  constructor(
    private readonly userService: UserService,
    private activatedRoute: ActivatedRoute,
    private readonly toastService: ToastService,
    private readonly authService: AuthService,
    private readonly friendService: FriendService
  ) {}

  userIsMe(id: number): boolean {
    return id === this.me.id;
  }

  refreshUser(): void {
    this.authService
      .refreshProfile()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (data) => {
          this.user = data;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  addFriend() {
    console.log('user id = ' + this.user.id);
    console.log('me id = ' + this.me.id);

    this.friendService.createFriendship(this.user.id, this.me.id);
    console.log('friends added');
    this.toastService.showInfo(
      'New friend !',
      this.user.firstName + ' is now your friend'
    );
  }

  ngOnInit() {
    this.activatedRoute.data.pipe(takeUntil(this.unsubscribeAll$)).subscribe({
      next: (data) => {
        this.user = data['user'];
      },
    });

    this.authService
      .getCurrentUser()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (data) => {
          this.me = data;
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
