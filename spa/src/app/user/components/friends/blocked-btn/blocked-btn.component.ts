import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../models';
import { FriendService } from '../../../services';

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

  state: 'BLOCK' | 'UNBLOCK' | 'DISABLE' = 'DISABLE';
  

  ngOnInit(): void {}
}
