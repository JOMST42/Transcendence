import { Component, Input, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { ToastService } from '../../../../core/services';
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
    private readonly toastService: ToastService
  ) {}

  buttonState: boolean = false;
  @Input() user!: User;
  @Input() me!: User;

  removeFriend() {
    this.friendService
      .removeFriendship(this.user.id, this.me.id)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.toastService.showWarn(
            'Friend removed !',
            'Ciao Bye ' + this.user.displayName
          );
          this.buttonState = true;
        },
        error: (err) => {
          this.toastService.showWarn('Ho ho', 'You are not friend ');
        },
      });
  }

  async checkState() {
    await this.friendService
      .checkFriendship(this.user.id, this.me.id)
      .then((data) => {
        if (data.adresseeId === this.me.id) {
          this.buttonState = false;
        } else {
          this.buttonState = true;
        }
      });
  }

  async ngOnInit(): Promise<void> {
    await this.checkState();
  }
}
