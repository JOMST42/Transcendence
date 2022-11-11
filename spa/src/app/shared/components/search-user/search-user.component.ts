import { Component, OnInit } from '@angular/core';
import { User } from '../../../user/models';
import { UserService } from '../../../user/services';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.scss'],
})
export class SearchUserComponent implements OnInit {
  constructor(private readonly userService: UserService) {}
  toSearch!: string;
  users!: User[];

  search() {
    console.log('test ' + this.toSearch);
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        if (data) {
          this.users = data;
          console.log(data);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
