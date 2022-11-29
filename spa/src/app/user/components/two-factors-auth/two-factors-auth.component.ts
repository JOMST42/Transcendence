import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { AuthService } from '../../../core/services';

@Component({
  selector: 'app-two-factors-auth',
  templateUrl: './two-factors-auth.component.html',
  styleUrls: ['./two-factors-auth.component.scss'],
})
export class TwoFactorsAuthComponent implements OnInit {
  constructor(private readonly authService: AuthService) {}

  codeQR!: string;
  displayDialog: boolean = false;

  showDialog(): void {
    this.displayDialog = true;
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
    this.getQRCode();
  }
}
