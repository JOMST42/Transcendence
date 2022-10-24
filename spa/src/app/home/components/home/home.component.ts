import { Component, OnInit } from '@angular/core';

import { UserService } from '../../../user/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor() {}

  handleClick() {
    window.location.href = 'http://localhost:3000/api/auth/ft/login';
  }

  ngOnInit(): void {}
}
