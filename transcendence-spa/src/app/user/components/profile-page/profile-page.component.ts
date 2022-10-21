import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User } from '../../../shared/models';
import { UserService } from '../../../core/services';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  user!: User;
  displayName!: string;
  newAvatarUrl!: string;
  data: any;

  constructor(
    private readonly userService: UserService,
    private activatedRoute: ActivatedRoute
  ) {}

  changeDisplayName() {
    this.userService
      .updateUserById(this.user.id, { displayName: this.displayName })
      .subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  changeAvatar() {
    this.userService
      .updateUserById(this.user.id, { avatarUrl: this.newAvatarUrl })
      .subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    //console.log(id);
    // this.activatedRoute.data.subscribe({
    //   next: (data: User) => {
    //     this.user = data;
    //   },
    // });

    this.userService.getUserById(Number(id)).subscribe({
      next: (data) => {
        this.user = data;
        //console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
