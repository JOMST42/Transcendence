import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../../user/models';
import { UserService } from '../../../user/services';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.scss'],
})
export class SearchUserComponent implements OnInit, OnDestroy {
  constructor(
    private readonly userService: UserService,
    public readonly router: Router
  ) {}
  private unsubscribeAll$ = new Subject<void>();
  toSearch!: string;
  users!: User[];
  loading: boolean = true;

  ngOnInit(): void {
    this.userService
      .getUsers()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (data) => {
          if (data) {
            this.users = data;
            this.loading = false;
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next();
  }
}
