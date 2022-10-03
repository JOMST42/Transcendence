import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule, ToastModule],
  providers: [MessageService],
  exports: [ToastModule],
})
export class CoreModule {}
