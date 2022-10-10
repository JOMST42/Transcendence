import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { Observable, ReplaySubject, take, switchMap, map } from 'rxjs';

import { User } from '../../shared/models';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new ReplaySubject<User | null>(1);
  private user$ = this.userSubject.asObservable();

  constructor(
    private readonly cookieService: CookieService,
    private readonly userService: UserService,
    private readonly jwtService: JwtHelperService
  ) {}

  getCurrentUser(): Observable<User | null> {
    return this.user$;
  }

  login(): Observable<User | null> {
    const token =
      this.cookieService.get('access_token') ||
      localStorage.getItem('access_token');

    if (!token) {
      console.log('No access token');
      return this.user$;
    }

    if (this.jwtService.isTokenExpired(token)) {
      this.logout();
      return this.user$;
    }

    localStorage.setItem('access_token', token);
    this.cookieService.delete('access_token');

    return this.userService.getProfile().pipe(
      take(1),
      map((user: User) => {
        this.userSubject.next(user);
        return user;
      })
    );
  }

  logout(): void {
    this.cookieService.delete('access_token');
    this.userSubject.next(null);
    localStorage.removeItem('access_token');
  }
}
