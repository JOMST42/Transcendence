import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

const tokenGetter = () => localStorage.getItem('access_token');

const config: SocketIoConfig = {
  url: 'http://localhost:3000',
  options: {
    extraHeaders: {
      Authorization: tokenGetter() || '',
    },
  },
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    ToastModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['localhost:3000'],
      },
    }),
    SocketIoModule.forRoot(config),
  ],
  providers: [MessageService, CookieService],
  exports: [ToastModule],
})
export class CoreModule {}
