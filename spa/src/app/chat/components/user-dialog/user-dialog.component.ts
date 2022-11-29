import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastService } from '../../../core/services';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
})
export class UserDialogComponent implements OnInit {
  role: 'ADMIN' | 'USER';
  roles = [
    { name: 'Admin', value: 'ADMIN' },
    { name: 'User', value: 'USER' },
  ];
  userId: number;

  constructor(
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.userId = this.config.data;
  }

  close(): void {
    if (!this.role) {
      this.toastService.showError('Error', 'Choose a role');
      return;
    }

    this.ref.close({
      role: this.role,
    });
  }
}
