import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private readonly messageService: MessageService) {}

  private showToast(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
  }

  showError(summary: string, detail: string): void {
    this.showToast('error', summary, detail);
  }

  showInfo(summary: string, detail: string): void {
    this.showToast('info', summary, detail);
  }

  showWarn(summary: string, detail: string): void {
    this.showToast('warn', summary, detail);
  }

  showSuccess(summary: string, detail: string): void {
    this.showToast('success', summary, detail);
  }
}
