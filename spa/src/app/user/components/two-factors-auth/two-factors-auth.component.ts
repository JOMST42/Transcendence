import { Component, Inject, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { AuthService, ToastService } from '../../../core/services';
import { User } from '../../models';

@Component({
  selector: 'app-two-factors-auth',
  templateUrl: './two-factors-auth.component.html',
  styleUrls: ['./two-factors-auth.component.scss'],
})
export class TwoFactorsAuthComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly toastService: ToastService
  ) {}

  me!: User;
  codeQR!: string;
  code!: string;
  displayDialog: boolean = false;

  showDialog(): void {
    this.displayDialog = true;
  }

  closeDialog(): void {
    this.displayDialog = false;
  }

  isCode(): boolean {
    if (this.code) {
      return true;
    }
    return false;
  }

  turnOnTwoFactorAuth() {
    if (!this.code) {
      console.error('pas de code');
    }
    this.authService
      .turnOnTwoFactorAuth(this.code)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.toastService.showSuccess(
            'Two Factor Authentication turn on',
            ''
          );
        },
        error: (err) => {
          this.toastService.showError('Oops turn', 'Something went wrong');
        },
      });
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
        },
      });
  }

  getQRCode(): void {
    this.authService
      .generateQR()
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.codeQR = data;
					this.showDialog();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  ngOnInit(): void {
    // this.authService
    //   .getCurrentUser()
    //   .pipe(take(1))
    //   .subscribe({
    //     next: (data) => {
    //       this.me = data;
    //     },
    //     error: (err) => {
    //       console.log(err);
    //     },
    //   });
  }
}
