import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { BaseApiService } from 'src/app/core/services';
import { UpdateFriendsDto, UpdateUserDto } from '../models';

@Injectable({
  providedIn: 'root',
})
export class FriendService {
  constructor(private readonly baseApiService: BaseApiService) {}

  getFriend(
    dto: UpdateFriendsDto,
    userId: number
  ): Observable<UpdateFriendsDto> {
    return this.baseApiService.getOne(
      `/users/${userId}/friend/${dto.adresseeId}`
    );
  }

  getFriends(userId: number): Observable<UpdateFriendsDto[]> {
    return this.baseApiService.getMany(`/users/${userId}/friends_list`);
  }

  getPendingInvitations(userId: number): Observable<UpdateFriendsDto[]> {
    return this.baseApiService.getMany(`/users/${userId}/pending_friends`);
  }

  updateFriendship(
    dto: UpdateFriendsDto,
    userId: number
  ): Observable<UpdateFriendsDto> {
    return this.baseApiService.patchOne(
      `/users/${userId}/addfriend/${dto.adresseeId}`,
      dto
    );
  }

  removeFriendship(
    dto: UpdateFriendsDto,
    userId: number
  ): Observable<UpdateFriendsDto> {
    return this.baseApiService.patchOne(
      `/users/${userId}/removefriend/${dto.adresseeId}`,
      dto
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
    dto: UpdateFriendsDto,
    userId: number
  ): Observable<UpdateFriendsDto> {
    return this.baseApiService.postOne(
      `/users/${userId}/createfriend/${dto.adresseeId}`,
      dto
    );
  }

  /*Check if there is a relation created between 2 users*/
  async checkFriendship(
    userId: number,
    meId: number
  ): Promise<UpdateFriendsDto> {
    return new Promise((resolve, reject) => {
      this.getFriend({ adresseeId: userId }, meId)
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
    console.log(userId + ' adressee ID');
    console.log(meId + ' me ID');
    const friend = await this.checkFriendship(userId, meId)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        this.createFriendship({ adresseeId: userId }, meId)
          .pipe(take(1))
          .subscribe({
            next: (data) => {
              console.log(data);
            },
          });
      });
  }
}
