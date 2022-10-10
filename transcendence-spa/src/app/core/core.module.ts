import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    ToastModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('access_token'),
        allowedDomains: ['localhost:3000'],
      },
    }),
  ],
  providers: [MessageService, CookieService],
  exports: [ToastModule],
})
export class CoreModule {}
