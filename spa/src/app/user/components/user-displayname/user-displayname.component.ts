import { InvokeFunctionExpr } from '@angular/compiler';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { AuthService, ToastService } from '../../../core/services';
import { User } from '../../models';
import { UserService } from '../../services';

@Component({
  selector: 'app-user-displayname',
  templateUrl: './user-displayname.component.html',
  styleUrls: ['./user-displayname.component.scss'],
})
export class UserDisplaynameComponent implements OnInit, OnDestroy {
  unsubscribeAll$ = new Subject<void>();
  displayName!: string;
  @Input() user!: User;
  @Input() userIsMe!: boolean;

  constructor(
    private readonly toast: ToastService,
    private readonly userService: UserService,
  ) {}

  inputValidator(): boolean {
    const pattern = /^[a-zA-Z_0-9_\-]+$/;
    if (!pattern.test(this.displayName)) {
      this.toast.showError('Nope ! ✋', 'Only letters, numbers, -, _ accepted');
      return false;
    }
    return true;
  }

  changeDisplayName() {
    if (this.inputValidator()) {
      this.userService
        .updateUserById(this.user.id, { displayName: this.displayName })
        .pipe(takeUntil(this.unsubscribeAll$))
        .subscribe({
          next: (data) => {
            this.toast.showSuccess(
              'Yay ! 🥳 ',
              'Your new display name is ' + this.displayName + ' !'
            );
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribeAll$.next();
  }
}
