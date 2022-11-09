import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject, take, takeUntil } from 'rxjs';

import { AuthService, BaseApiService } from '../../core/services';
import { UpdateUserDto, User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private readonly baseApiService: BaseApiService,
    private readonly authService: AuthService
  ) {}
  private unsubscribeAll$ = new Subject<void>();
  user!: User;

  getUserById(id: number): Observable<User> {
    return this.baseApiService.getOne(`/users/${id}`);
  }

  updateUserById(id: number, dto: UpdateUserDto): Observable<User> {
    return this.baseApiService.patchOne(`/users/${id}`, dto);
  }

  findByDisplayName(displayName: string): Observable<User[]> {
    const params = new HttpParams();
    params.append('displayName', displayName);
    return this.baseApiService.getMany('/users', params);
  }
}
