import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastService } from '../../../core/services';
import { Room } from '../../models';

@Component({
  selector: 'app-channel-create',
  templateUrl: './channel-create.component.html',
  styleUrls: ['./channel-create.component.scss'],
})
export class ChannelCreateComponent implements OnInit {
  name = '';
  visibility = 'PUBLIC';
  password = '';

  visOptions = [
    { name: 'Public', value: 'PUBLIC' },
    { name: 'Private', value: 'PRIVATE' },
  ];

  constructor(
    private readonly toastService: ToastService,
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {}

  close(): void {
    this.name = this.name.trim();
    if (this.name.length < 4) {
      this.toastService.showError(
        'Invalid name',
        'The channel name must have at least 4 characters'
      );
      return;
    }
    this.password = this.password.trim();
    if (this.password.length > 0 && this.password.length < 8) {
      this.toastService.showError(
        'Invalid password',
        'The channel password must have at least 8 characters'
      );
      return;
    }
    this.ref.close({
      name: this.name,
      visibility: this.visibility,
      password: this.password,
    });
  }
}
