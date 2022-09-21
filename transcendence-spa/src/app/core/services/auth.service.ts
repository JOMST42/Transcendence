import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, ReplaySubject, take, switchMap, map } from 'rxjs';

import { User } from '../../shared/models';
import { BaseApiService } from './base-api.service';
import { JwtService } from './jwt.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new ReplaySubject<User | null>(1);
  private user$ = this.userSubject.asObservable();

  constructor(
    private readonly baseApiService: BaseApiService,
    private readonly cookieService: CookieService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  refreshToken(): Observable<void> {
    return this.baseApiService.getOne('/auth/refresh-token');
  }

  getCurrentUser(): Observable<User | null> {
    return this.user$;
  }

  login(): Observable<User | null> {
    const token =
      localStorage.getItem('token') || this.cookieService.get('refresh_token');
    if (!token) {
      console.log('No refresh token');
      return this.user$;
    }

    if (this.jwtService.isExpired(token)) {
      this.logout();
      return this.user$;
    }

    this.cookieService.set('refresh_token', token);

    return this.refreshToken().pipe(
      take(1),
      switchMap(() => {
        const newToken = this.cookieService.get('refresh_token');
        localStorage.setItem('token', newToken);
        return this.userService.getProfile();
      }),
      map((user: User) => {
        this.userSubject.next(user);
        return user;
      })
    );
  }

  logout(): void {
    this.cookieService.delete('access_token');
    this.cookieService.delete('refresh_token');
    this.userSubject.next(null);
    localStorage.removeItem('token');
  }
}
