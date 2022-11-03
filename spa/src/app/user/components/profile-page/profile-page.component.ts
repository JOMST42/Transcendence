import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';

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
