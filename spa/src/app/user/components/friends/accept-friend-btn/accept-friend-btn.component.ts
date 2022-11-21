import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { AuthService, ToastService } from '../../../../core/services';
import { User } from '../../../models';
import { FriendService } from '../../../services';

@Component({
  selector: 'app-accept-friend-btn',
  templateUrl: './accept-friend-btn.component.html',
  styleUrls: ['./accept-friend-btn.component.scss'],
})
export class AcceptFriendBtnComponent implements OnInit {
  constructor(
    private readonly friendService: FriendService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  buttonState: boolean = false;
  @Input() user!: User;
  me!: User;

  resetPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['./'], {
      relativeTo: this.route,
    });
  }

  acceptNewFriend() {
    this.friendService
      .updateFriendship(this.user.id, this.me.id)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          console.log(data);
          this.buttonState = false;
        },
      });
  }

  async checkState() {
    await this.friendService
      .checkFriendship(this.user.id, this.me.id)
      .then((data) => {
        if (data.adresseeId === this.me.id) {
          this.buttonState = true;
        } else {
          this.buttonState = false;
        }
      })
      .catch((err) => console.log('err catch dans accept friend btn'));
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (data) => {
        this.me = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
