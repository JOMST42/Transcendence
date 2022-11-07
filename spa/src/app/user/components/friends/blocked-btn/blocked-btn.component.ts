import { Component, Input, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { User } from '../../../models';
import { FriendService } from '../../../services';

type ButtonState = 'BLOCK' | 'UNBLOCK' | 'DISABLE';
@Component({
  selector: 'app-blocked-btn',
  templateUrl: './blocked-btn.component.html',
  styleUrls: ['./blocked-btn.component.scss'],
})
export class BlockedBtnComponent implements OnInit {
  constructor(private readonly friendService: FriendService) {}

  @Input() user!: User;
  @Input() me!: User;
  @Input() userIsMe!: boolean;

  state: ButtonState = 'BLOCK';

  async initButton() {
    await this.friendService
      .checkFriendship(this.user.id, this.me.id)
      .then((data) => {
        if (data.blocked === true) {
          this.state = 'UNBLOCK';
        }
        if (data.blocked === false) {
          this.state = 'BLOCK';
        }
        console.log(this.state);
      }); // faire le catch ou on créait la friendship si elle n'exsite pas
  }

  friendButton(state: ButtonState) {
    switch (state) {
      case 'BLOCK': {
        this.blockFriend(this.user.id, this.me.id);
        console.log(this.user.id + ' ' + this.me.id);
        break;
      }
      case 'UNBLOCK': {
        this.unblockFriend(this.user.id, this.me.id);
        break;
      }
      case 'DISABLE': {
        break;
      }
    }
  }

  blockFriend(toBlockId: number, blockerId: number) {
    this.friendService
      .blockFriend(toBlockId, blockerId)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          console.log(data);
        },
      });
  }

  unblockFriend(toUnblockId: number, unblockerId: number) {
    this.friendService
      .unblockFriend(toUnblockId, unblockerId)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          console.log(data);
        },
      });
  }

  async ngOnInit(): Promise<void> {
    await this.initButton();
  }
}
