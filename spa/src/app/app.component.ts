import { Component, OnInit } from '@angular/core';

import { AuthService } from './core/services';
import { User } from './user/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.login().subscribe((user: User | null) => {});
  }
}
