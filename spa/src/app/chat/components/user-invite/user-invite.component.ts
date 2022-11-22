import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { User } from '../../../user/models';

@Component({
  selector: 'app-user-invite',
  templateUrl: './user-invite.component.html',
  styleUrls: ['./user-invite.component.scss'],
})
export class UserInviteComponent implements OnInit {
  text: string;
  users: User[];
  selectedUserId: number;

  constructor(
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.users = this.config.data;
  }

  close(): void {
    this.ref.close(this.selectedUserId);
  }
}
