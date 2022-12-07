import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';

import { User } from '../../models';
import { AuthService } from '../../../core/services';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  user!: User;
  me!: User;
  displayName!: string;
  requestsNb!: number;
  private unsubscribeAll$ = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private readonly authService: AuthService
  ) {}

  ngOnDestroy(): void {
    this.unsubscribeAll$.next();
  }

  getRequestNumber(newRequest: number): void {
    this.requestsNb = newRequest;
  }

  refreshUser(): void {
    this.authService
      .refreshProfile()
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.user = data;
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
      });
  }
}
