import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { NotFoundComponent, ServerErrorComponent } from './components';

@NgModule({
  declarations: [NotFoundComponent, ServerErrorComponent],
  imports: [CommonModule, FormsModule, ButtonModule, TableModule],
  exports: [CommonModule, FormsModule, ButtonModule, TableModule],
})
export class SharedModule {}
