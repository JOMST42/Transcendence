import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services';
import { User } from '../../../user/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  user!: User | null;

  constructor(private readonly authService: AuthService) {}

  handleClick() {
    window.location.href = 'http://localhost:3000/api/auth/ft/login';
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.authService.getCurrentUser().subscribe({
      next: (user: User | null) => {
        this.user = user;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
