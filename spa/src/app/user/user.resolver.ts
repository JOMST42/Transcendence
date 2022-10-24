import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { User } from './models';
import { UserService } from './services';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<User | string> {
  constructor(private userService: UserService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<User | string> {
    const id = route.paramMap.get('id');
    return this.userService.getUserById(Number(id)).pipe(
      catchError(() => {
        return of('data not available at this time');
      })
    );
  }
}
