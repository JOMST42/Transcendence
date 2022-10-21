import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  user!: User;

  constructor(private readonly userService: UserService) {}

  handleClick() {
    window.location.href = 'http://localhost:3000/api/auth/ft/login';
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.userService.getProfile().subscribe({
      next: (user: User) => {
        this.user = user;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
