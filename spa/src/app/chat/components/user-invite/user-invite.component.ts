import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { User } from '../../../user/models';
import { UserService } from '../../../user/services';

@Component({
  selector: 'app-user-invite',
  templateUrl: './user-invite.component.html',
  styleUrls: ['./user-invite.component.scss'],
})
export class UserInviteComponent implements OnInit {
  text: string;
  users: User[];

  constructor(private readonly userService: UserService) {}

  ngOnInit(): void {}

  search(event: any): void {
    this.userService
      .findByDisplayName(event.query)
      .pipe(take(1))
      .subscribe((users) => {
        this.users = users;
      });
  }
}
