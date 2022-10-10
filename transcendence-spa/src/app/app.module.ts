import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core';
import { CredentialsInterceptor } from './core/interceptors/credentials.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CredentialsInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
