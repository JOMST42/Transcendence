import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApiService } from '../../core/services';
import { UpdateUserDto, User } from '../models';
import { Game } from '../../watch/models';

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

  findByDisplayName(displayName: string): Observable<User[]> {
    const params = new HttpParams();
    params.append('displayName', displayName);
    return this.baseApiService.getMany('/users', params);
  }

  getUsers(): Observable<User[]> {
    return this.baseApiService.getMany('/users/all');
  }

  getGamesByUserId(id: number): Observable<Game[]> {
    return this.baseApiService.getMany(`/games/${id}/all`);
  }
}
