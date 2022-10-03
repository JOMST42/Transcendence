import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { NotFoundComponent, ServerErrorComponent } from './components';

@NgModule({
  declarations: [NotFoundComponent, ServerErrorComponent],
  imports: [CommonModule, FormsModule, ButtonModule],
  exports: [CommonModule, FormsModule, ButtonModule],
})
export class SharedModule {}
