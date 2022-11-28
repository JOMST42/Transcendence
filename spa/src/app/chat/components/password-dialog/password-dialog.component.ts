import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastService } from '../../../core/services';

@Component({
  selector: 'app-password-dialog',
  templateUrl: './password-dialog.component.html',
  styleUrls: ['./password-dialog.component.scss'],
})
export class PasswordDialogComponent implements OnInit {
  password = '';

  constructor(
    private readonly toastService: ToastService,
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {}

  close(): void {
    this.password = this.password.trim();

    this.ref.close({
      password: this.password,
    });
  }
}
