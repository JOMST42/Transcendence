import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';

import { User } from '../../models';
import { AuthService } from '../../../core/services';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  user!: User;
  me!: User;
  displayName!: string;
  requestsNb!: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private readonly authService: AuthService
  ) {}

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
        error: (err) => {
          console.log(err);
        },
      });
  }

  ngOnInit() {
    this.activatedRoute.data.pipe(take(1)).subscribe({
      next: (data) => {
        this.user = data['user'];
      },
    });

    this.authService
      .getCurrentUser()
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.me = data;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
