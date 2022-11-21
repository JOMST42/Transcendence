import {
  animate,
  keyframes,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services';
import { Friendship, User } from '../../../models';
import { FriendService, UserService } from '../../../services';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.scss'],
  animations: [
    trigger('stagger', [
      transition('* => *', [
        // each time the binding value changes
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(
          ':enter',
          stagger('500ms', [
            animate(
              '500ms ease-in',
              keyframes([
                style({ opacity: 0, transform: 'translateY(0%)', offset: 0 }),
                style({
                  opacity: 0.5,
                  transform: 'translateY(0px) scale(1.1)',
                  offset: 0.3,
                }),
                style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
              ])
            ),
          ]),
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class FriendListComponent implements OnInit {
  constructor(
    private readonly friendService: FriendService,
    private readonly authService: AuthService,
  ) {}
  friendsList!: Friendship[];
  userList!: User[];
  me!: User;
  @Input() user!: User;

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (data) => {
        this.me = data;
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.friendService.getFriendships(this.me.id).subscribe({
      next: (data) => {
        this.friendsList = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
