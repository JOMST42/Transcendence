import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { CredentialsInterceptor, ErrorInterceptor } from './core/interceptors';
import { SharedModule } from './shared/shared.module';
import { MatchHistoryComponent } from './shared/components/match-history/match-history.component';
import { GameInviteComponent } from './pong/components/game-invite/game-invite.component';
import { PongModule } from './pong/pong.module';

@NgModule({
  declarations: [AppComponent],
  imports: [ 
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
		PongModule,
    SharedModule,
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
