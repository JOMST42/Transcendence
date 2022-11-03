import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { Socket, SocketIoModule } from 'ngx-socket-io';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';

const tokenGetter = () => localStorage.getItem('access_token');

@Injectable()
export class PongSocket extends Socket {
  constructor() {
    super({
      url: 'http://localhost:3000/pong',
      options: {
        extraHeaders: {
          Authorization: tokenGetter() || '',
        },
      },
    });
  }
}

@Injectable()
export class ChatSocket extends Socket {
  constructor() {
    super({
      url: 'http://localhost:3000/chat',
      options: {
        extraHeaders: {
          Authorization: tokenGetter() || '',
        },
      },
    });
  }
}

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
  ],
  providers: [MessageService, CookieService, PongSocket, ChatSocket],
  exports: [ToastModule, DialogModule],
})
export class CoreModule {}
