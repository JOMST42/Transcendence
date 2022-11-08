import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../models';

@Component({
  selector: 'app-friend-card',
  templateUrl: './friend-card.component.html',
  styleUrls: ['./friend-card.component.scss'],
})
export class FriendCardComponent implements OnInit {
  @Input() user!: User;
  @Input() userIsMe!: boolean;
  @Input() me: User;
  constructor() {}

  ngOnInit(): void {}
}
