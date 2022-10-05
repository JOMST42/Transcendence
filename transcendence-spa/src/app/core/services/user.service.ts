import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '../../shared/models';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly baseApiService: BaseApiService) {}

  getProfile(): Observable<User> {
    return this.baseApiService.getOne('/users/me');
  }
}
