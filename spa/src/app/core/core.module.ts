import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Injectable, NgModule, OnDestroy } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
import { DialogModule } from 'primeng/dialog';

import { SocketError } from './models';
import { ToastService } from './services';
import { DialogService } from 'primeng/dynamicdialog';
import { ClickStopPropagation } from './directives';

const tokenGetter = () => localStorage.getItem('access_token');

@Injectable()
export class PongSocket extends Socket {
  constructor() {
    super({
      url: 'http://10.12.2.11:3000/pong',
      options: {
        extraHeaders: {
          Authorization: tokenGetter() || '',
        },
      },
    });
  }
}
@Injectable()
export class ChatSocket extends Socket implements OnDestroy {
  unsubscribeAll$ = new Subject<void>();

  constructor(toastService: ToastService) {
    super({
      url: 'http://10.12.2.11:3000/chat',
      options: {
        extraHeaders: {
          Authorization: tokenGetter() || '',
        },
      },
    });

    this.fromEvent<SocketError>('socketError')
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((err: SocketError) => {
        toastService.showError('Error', err.message);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next();
  }
}

@NgModule({
  declarations: [ClickStopPropagation],
  imports: [
    CommonModule,
    HttpClientModule,
    ToastModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['10.12.2.11:3000'],
      },
    }),
  ],
  providers: [
    MessageService,
    CookieService,
    PongSocket,
    ChatSocket,
    DialogService,
  ],
  exports: [ToastModule, DialogModule],
})
export class CoreModule {}
