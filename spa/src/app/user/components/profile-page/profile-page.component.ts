import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { User } from '../../models';
import { UserService } from '../../services';
import { AuthService, ToastService } from '../../../core/services';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  unsubscribeAll$ = new Subject<void>();

  user!: User;
  me!: User;
  displayName!: string;

  constructor(
    private readonly userService: UserService,
    private activatedRoute: ActivatedRoute,
    private readonly toast: ToastService,
    private readonly auth: AuthService
  ) {}

  userIsMe(id: number): boolean {
    return id === this.me.id;
  }

  refreshUser(): void {
    this.auth
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

  addFriend(): void {
    console.log('friends added');
    this.toast.showInfo('New friend !', 'Pouet is now your friend');
  }

  ngOnInit() {
    this.activatedRoute.data.pipe(takeUntil(this.unsubscribeAll$)).subscribe({
      next: (data) => {
        this.user = data['user'];
      },
    });

    this.auth
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
