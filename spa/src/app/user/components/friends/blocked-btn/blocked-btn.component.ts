import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() stateChange = new EventEmitter<ButtonState>();

  state: ButtonState = 'BLOCK';

  stateChanged(state: ButtonState) {
    this.stateChange.emit();
  }

  async initButton() {
    if (this.me.id != this.user.id) {
      await this.friendService
        .checkFriendship(this.user.id, this.me.id)
        .then((data) => {
          if (data.adresseeId === this.me.id) {
            if (data.adresseeBlocker === true) {
              this.state = 'UNBLOCK';
            } else {
              this.state = 'BLOCK';
            }
          }
          if (data.requesterId === this.me.id) {
            if (data.requesterBlocker === true) {
              this.state = 'UNBLOCK';
            } else {
              this.state = 'BLOCK';
            }
          }
          console.log(this.state);
        })
        .catch((data) => {
          this.friendService
            .createFriendship(this.user.id, this.me.id)
            .pipe(take(1))
            .subscribe({
              next: (data) => {
                if (data.adresseeId === this.me.id) {
                  if (data.adresseeBlocker === true) {
                    this.state = 'UNBLOCK';
                  } else {
                    this.state = 'BLOCK';
                  }
                }
                if (data.requesterId === this.me.id) {
                  if (data.requesterBlocker === true) {
                    this.state = 'UNBLOCK';
                  } else {
                    this.state = 'BLOCK';
                  }
                }
              },
            });
        });
    }
  }

  friendButton(state: ButtonState) {
    switch (state) {
      case 'BLOCK': {
        this.blockFriend(this.user.id, this.me.id);
        break;
      }
      case 'UNBLOCK': {
        this.unblockFriend(this.user.id, this.me.id);
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
          this.state = 'UNBLOCK';
        },
      });
  }

  unblockFriend(toUnblockId: number, unblockerId: number) {
    this.friendService
      .unblockFriend(toUnblockId, unblockerId)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.state = 'BLOCK';
        },
      });
  }

  async ngOnInit(): Promise<void> {
    await this.initButton();
  }
}
