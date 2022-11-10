import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../core/services';

import { User } from './models';
import { UserService } from './services';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<User> {
  constructor(private userService: UserService, private authService: AuthService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    const id = route.paramMap.get('id');
		if (id === null || isNaN(+id))
    	return this.authService.getCurrentUser();
		else
			return this.userService.getUserById(+id);
  }
}
