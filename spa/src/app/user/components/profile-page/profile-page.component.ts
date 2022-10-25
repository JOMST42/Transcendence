import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../../models';
import { UserService } from '../../services';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  user!: User;
  me!: User;
  userme: Boolean = false;
  displayName!: string;

  constructor(
    private readonly userService: UserService,
    private activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  // resetPage() {
  //   this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  //   this.router.onSameUrlNavigation = 'reload';
  //   this.router.navigate(['./'], {
  //     relativeTo: this.route,
  //   });
  // }

  refreshUser(){
    this.userService.getProfile().subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

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

  ngOnInit() {

    this.activatedRoute.data.subscribe({
      next: (data) => {
        this.user = data['user'];
      },
    });

    this.userService.getProfile().subscribe({
      next: (data) => {
        this.me = data;
        if (this.me.id === this.user.id) {
          this.userme = true;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
