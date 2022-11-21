import { Component, Input, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { AuthService, ToastService } from '../../../../core/services';
import { User } from '../../../models';
import { FriendService } from '../../../services';

@Component({
  selector: 'app-refuse-friend-btn',
  templateUrl: './refuse-friend-btn.component.html',
  styleUrls: ['./refuse-friend-btn.component.scss'],
})
export class RefuseFriendBtnComponent implements OnInit {
  constructor(
    private readonly friendService: FriendService,
    private readonly toastService: ToastService,
    private readonly authService: AuthService
  ) {}

  buttonState: boolean = false;
  @Input() user!: User;
  me!: User;

  removeFriend() {
    console.log('dans remove friends');
    this.friendService
      .removeFriendship(this.user.id, this.me.id)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.toastService.showWarn(
            'Friend removed !',
            'Ciao Bye ' + this.user.displayName
          );
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
      .catch((err) => console.log('err catch dans refuse friend btn'));
  }

  async ngOnInit(): Promise<void> {
    this.authService.getCurrentUser().subscribe({
      next: (data) => {
        this.me = data;
      },
      error: (err) => {
        console.log(err);
      },
    });

    await this.checkState();
  }
}
