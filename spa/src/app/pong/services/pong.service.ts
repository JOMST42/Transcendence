import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable, Subject, Subscription, take } from 'rxjs';
import { Response } from 'src/app/play/interfaces';
import { User } from 'src/app/user/models';

import {  AuthService, BaseApiService } from '../../core/services';
import { UserState } from '../data/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PongService {
	user?: User;
	userState?: UserState;
	private interval: NodeJS.Timer;
	private updateSub: Subscription;

  constructor(
    private readonly baseApiService: BaseApiService,
		private readonly authService: AuthService
  ) {
		// this.interval = setInterval(() => this.updateState(), 2000);
		this.interval = setInterval(() => this.updateUser(), 2000);
	}

	updateUser() {
		if (this.user){
			clearInterval(this.interval);
			return;
		}
		this.authService
      .getCurrentUser()
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.user = data;
        },
        error: (err) => {
          console.log(err);
        },
      });
	}

	updateState() {
		if (!this.user) return this.updateUser();
		this.updateSub?.unsubscribe();
		this.updateSub = this.baseApiService.getOne(`/pong/${this.user.id}/userState`).pipe(take(1)).subscribe({
      next: (data: Response) => {
        this.userState = data.payload;
      },
      error: (err) => {
        console.log(err);
      },
    });
	}

	

  canInvite(id: number): Observable<Response> {
    return this.baseApiService.getOne(`/pong/${id}/canInvite`);
  }

	canQueue(id: number): Observable<Response> {
    return this.baseApiService.getOne(`/pong/${id}/canQueue`);
  }

	canJoinGame(id: number): Observable<Response> {
    return this.baseApiService.getOne(`/pong/${id}/canJoinGame`);
  }

  // updateUserById(id: number, dto: UpdateUserDto): Observable<User> {
  //   return this.baseApiService.patchOne(`/users/${id}`, dto);
  // }

  // findByDisplayName(displayName: string): Observable<User[]> {
  //   const params = new HttpParams();
  //   params.append('displayName', displayName);
  //   return this.baseApiService.getMany('/users', params);
  // }

  // getUsers(): Observable<User[]> {
  //   return this.baseApiService.getMany('/users/all');
  // }
}
