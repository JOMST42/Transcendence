import { Component, Input, OnInit } from '@angular/core';
import { Subject, take } from 'rxjs';
import { ToastService } from '../../../../core/services';
import { User } from '../../../models';
import { FriendService } from '../../../services';

@Component({
  selector: 'app-add-friend-btn',
  templateUrl: './add-friend-btn.component.html',
  styleUrls: ['./add-friend-btn.component.scss'],
})
export class AddFriendBtnComponent implements OnInit {
  constructor(
    private readonly friendService: FriendService,
    private readonly toastService: ToastService
  ) {}

  @Input() user!: User;
  @Input() me!: User;
  @Input() userIsMe!: boolean;

  // faire une fonction qui vérifie si on est pas déjà ami
  addFriend() {
    this.friendService
      .createFriendship({ adresseeId: this.user.id }, this.me.id)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          console.log(data);
        },
      });
  }

  acceptNewFriend() {
    this.friendService
      .updateFriendship(
        { adresseeId: this.user.id, requesterId: this.me.id },
        this.me.id
      )
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          console.log(data);
        },
      });
  }

  removeFriend() {
    this.friendService
      .removeFriendship(
        { adresseeId: this.user.id, requesterId: this.me.id },
        this.me.id
      )
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          console.log(data);
        },
      });
  }
  ngOnInit(): void {}
}
