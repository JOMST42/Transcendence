import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { AuthService } from '../../../core/services';
import { User } from '../../models';

@Component({
  selector: 'app-two-factors-auth',
  templateUrl: './two-factors-auth.component.html',
  styleUrls: ['./two-factors-auth.component.scss'],
})
export class TwoFactorsAuthComponent implements OnInit {
  constructor(private readonly authService: AuthService) {}

  me!: User;
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

  turnOnTwoFactorAuth() {
    if (!this.code) {
      console.error('pas de code');
    }
    this.authService
      .turnOnTwoFactorAuth(this.code)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          console.log('ca a fonctionné');
        },
        error: (err) => {
          console.log('ca a pas fonctionné');
        },
      });
  }

  authenticate() {
    this.authService
      .authenticateTwoFactorAuth(this.code)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          console.log('authentifié');
        },
        error: (err) => {
          console.log('pas auth');
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
          console.log(data);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  ngOnInit(): void {
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

    this.getQRCode();
  }
}
