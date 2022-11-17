import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastService } from '../../../core/services';

@Component({
  selector: 'app-channel-create',
  templateUrl: './channel-create.component.html',
  styleUrls: ['./channel-create.component.scss'],
})
export class ChannelCreateComponent implements OnInit {
  name = '';

  constructor(
    private readonly toastService: ToastService,
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {}

  close(): void {
    if (this.name.length < 4) {
      this.toastService.showError(
        'Invalid name',
        'The channel name must have at least 4 characters'
      );
      return;
    }
    this.ref.close(this.name);
  }
}
