import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { BaseApiService } from 'src/app/core/services';
import { UpdateFriendsDto } from '../models';

@Injectable({
  providedIn: 'root',
})
export class FriendService {
  constructor(private readonly baseApiService: BaseApiService) {}

  getFriend(adresseeId: number, userId: number): Observable<UpdateFriendsDto> {
    return this.baseApiService.getOne(`/users/${userId}/friend/${adresseeId}`);
  }

  getFriends(userId: number): Observable<UpdateFriendsDto[]> {
    return this.baseApiService.getMany(`/users/${userId}/friends_list`);
  }

  getPendingInvitations(userId: number): Observable<UpdateFriendsDto[]> {
    return this.baseApiService.getMany(`/users/${userId}/pending_friends`);
  }

  updateFriendship(
    adresseeId: number,
    userId: number
  ): Observable<UpdateFriendsDto> {
    return this.baseApiService.patchOne(
      `/users/${userId}/addfriend/${adresseeId}`
    );
  }

  removeFriendship(
    adresseeId: number,
    userId: number
  ): Observable<UpdateFriendsDto> {
    return this.baseApiService.patchOne(
      `/users/${userId}/removefriend/${adresseeId}`
    );
  }

  blockFriend(
    adresseeId: number,
    userId: number
  ): Observable<UpdateFriendsDto> {
    console.log('dans service front');
    return this.baseApiService.patchOne(
      `/users/${userId}/blockfriend/${adresseeId}`
    );
  }

  unblockFriend(
    adresseeId: number,
    userId: number
  ): Observable<UpdateFriendsDto> {
    return this.baseApiService.patchOne(
      `/users/${userId}/unblockfriend/${adresseeId}`
    );
  }

  createFriendship(
    adresseeId: number,
    userId: number
  ): Observable<UpdateFriendsDto> {
    return this.baseApiService.postOne(
      `/users/${userId}/createfriend/${adresseeId}`
    );
  }

  /*Check if there is a relation created between 2 users*/
  async checkFriendship(
    userId: number,
    meId: number
  ): Promise<UpdateFriendsDto> {
    return new Promise((resolve, reject) => {
      this.getFriend(userId, meId)
        .pipe(take(1))
        .subscribe({
          next: (data) => {
            if (data) {
              resolve(data);
              console.log(data);
            }
            console.log(data);
            reject(null);
          },
        });
    });
  }

  async addFriend(userId: number, meId: number) {
    const friend = await this.checkFriendship(userId, meId)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        this.createFriendship(userId, meId)
          .pipe(take(1))
          .subscribe({
            next: (data) => {
              console.log(data);
            },
          });
      });
  }
}
