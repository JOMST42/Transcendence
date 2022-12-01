import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';

import { ToastService } from '../../../core/services';
import { User } from '../../models';
import { UserService } from '../../services';

@Component({
  selector: 'app-user-displayname',
  templateUrl: './user-displayname.component.html',
  styleUrls: ['./user-displayname.component.scss'],
})
export class UserDisplaynameComponent implements OnInit {
  displayName!: string;
  showButton: boolean = false;
  @Input() user!: User;
  @Input() userIsMe!: boolean;

  constructor(
    private readonly toast: ToastService,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  focusInput(): void {
    this.showButton = true;
  }

  inputValidator(): boolean {
    const pattern = /^[a-zA-Z_0-9_\-]+$/;
    if (!pattern.test(this.displayName)) {
      this.toast.showError('Nope ! ✋', 'Only letters, numbers, -, _ accepted');
      this.displayName = '';
      this.resetPage();
      return false;
    }
    this.resetPage();

    return true;
  }

  resetPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['./'], {
      relativeTo: this.route,
    });
  }

  changeDisplayName() {
    if (this.inputValidator()) {
      this.userService
        .updateUserById(this.user.id, { displayName: this.displayName })
        .pipe(take(1))
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
}
