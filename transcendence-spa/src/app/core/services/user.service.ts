import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UpdateUserDto, User } from '../../shared/models';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly baseApiService: BaseApiService) {}

  getUserById(id: number): Observable<User> {
    return this.baseApiService.getOne(`/users/${id}`);
  }

  updateUserById(id: number, dto: UpdateUserDto): Observable<User> {
    return this.baseApiService.patchOne(`/users/${id}`, dto);
  }

  getProfile(): Observable<User> {
    return this.baseApiService.getOne('/users/me');
  }
}
