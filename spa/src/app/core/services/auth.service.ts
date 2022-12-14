import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { Observable, ReplaySubject, take, map } from 'rxjs';

import { User } from '../../user/models';
import { ChatSocket } from '../core.module';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new ReplaySubject<User>(1);
  private user$ = this.userSubject.asObservable();

  constructor(
    private readonly cookieService: CookieService,
    private readonly jwtService: JwtHelperService,
    private readonly baseApiService: BaseApiService,
    private readonly chatSocket: ChatSocket
  ) {}

  getCurrentUser(): Observable<User> {
    return this.user$;
  }

  setCurrentUser(user: User): void {
    this.userSubject.next(user);
  }

  refreshProfile(): Observable<User> {
    return this.getProfile().pipe(
      take(1),
      map((user: User) => {
        this.userSubject.next(user);
        return user;
      })
    );
  }

  getProfile(): Observable<User> {
    return this.baseApiService.getOne('/users/me');
  }

  login(): Observable<User> {
    const token =
      this.cookieService.get('access_token') ||
      localStorage.getItem('access_token');

    if (!token) {
      this.logout();
      return this.user$;
    }

    if (this.jwtService.isTokenExpired(token)) {
      this.logout();
      return this.user$;
    }
    localStorage.setItem('access_token', token);
    this.cookieService.delete('access_token');
    return this.refreshProfile();
  }

  logout(): void {
    this.cookieService.delete('access_token');
    this.userSubject.next(null);
    localStorage.removeItem('access_token');
  }

  generateQR(): Observable<string> {
    return this.baseApiService.postOne('/auth/2fa/generate');
  }

  turnOnTwoFactorAuth(code: string) {
    return this.baseApiService.postOne('/auth/2fa/turn-on', { code: code });
  }

  turnOffTwoFactorAuth() {
    return this.baseApiService.postOne('/auth/2fa/turn-off');
  }

  authenticateTwoFactorAuth(code: string) {
    return this.baseApiService.postOne('/auth/2fa/authenticate', {
      code: code,
    });
  }
}
