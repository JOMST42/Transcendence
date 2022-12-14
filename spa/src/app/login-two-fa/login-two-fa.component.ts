import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AuthService, ToastService } from '../core/services';

@Component({
  selector: 'app-login-two-fa',
  templateUrl: './login-two-fa.component.html',
  styleUrls: ['./login-two-fa.component.scss'],
})
export class LoginTwoFAComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
    private router: Router
  ) {}

  codeQR!: string;
  code!: string;
  displayDialog: boolean = false;

  showDialog(): void {
    this.displayDialog = true;
  }

  isCode(): boolean {
    if (this.code) {
      return true;
    }
    return false;
  }

  authenticate() {
    this.authService
      .authenticateTwoFactorAuth(this.code)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.toastService.showSuccess(
            'Two Factor Authentication success',
            ''
          );
          this.authService
            .login()
            .pipe(take(1))
            .subscribe({
              next: (data) => {
                this.router.navigate(['']);
              },
            });
        },
      });
  }

  ngOnInit(): void {}
}
