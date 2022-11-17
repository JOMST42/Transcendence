import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';

import { User } from '../../models';
import { AuthService, ToastService } from '../../../core/services';
import { UserService } from '../../services';

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
    private activatedRoute: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly toastService: ToastService
  ) {}

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
