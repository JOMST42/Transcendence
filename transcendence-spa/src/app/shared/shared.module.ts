import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { NotFoundComponent, ServerErrorComponent } from './components';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { TitleComponent } from './components/title/title.component';

@NgModule({
  declarations: [NotFoundComponent, ServerErrorComponent, NavBarComponent, TitleComponent],
  imports: [CommonModule, FormsModule, ButtonModule, TableModule],
  exports: [CommonModule, FormsModule, ButtonModule, TableModule],
})
export class SharedModule {}
