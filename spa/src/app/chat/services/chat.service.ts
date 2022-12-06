import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';

import { ChatSocket } from '../../core/core.module';
import { BaseApiService } from '../../core/services';
import { User } from '../../user/models';
import { BanUserDto, ChatMessage, Room, UserChatRoom } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private socket: ChatSocket,
    private readonly baseApiService: BaseApiService
  ) {}

  getChatRoomList(): Observable<Room[]> {
    return this.baseApiService.getMany<Room>('/chatrooms');
  }

  getNewRoom(): Observable<Room> {
    return this.socket.fromEvent<Room>('newRoom');
  }

  createRoom(room: Room): Observable<Room> {
    return this.baseApiService.postOne<Room>('/chatrooms', room);
  }

  joinRoom(roomId: string): void {
    this.socket.emit('joinRoom', roomId);
  }

  leaveRoom(roomId: string): void {
    this.socket.emit('leaveRoom', roomId);
  }

  getNewUser(): Observable<UserChatRoom> {
    return this.socket.fromEvent<UserChatRoom>('newRoomUser');
  }

  sendMessage(message: ChatMessage, callback?: any): void {
    this.socket.emit('sendMessage', message, (data: any) => {
      if (callback) {
        callback(data);
      }
    });
  }

  getNewMessage(): Observable<ChatMessage> {
    return this.socket.fromEvent<ChatMessage>('newMessage');
  }

  getChatRoom(id: string): Observable<Room> {
    return this.baseApiService.getOne(`/chatrooms/${id}`);
  }

  addUserToRoom(
    userId: number,
    roomId: string,
    password?: string
  ): Observable<void> {
    return this.baseApiService.postOne(`/chatrooms/${roomId}`, { password });
  }

  inviteUser(userId: number, roomId: string): void {
    this.socket.emit('inviteUser', { userId, roomId });
  }

  userLeaveRoom(roomId: string): Observable<void> {
    return this.baseApiService.deleteOne(`/chatrooms/${roomId}`);
  }

  getRoomUser(roomId: string, userId: number): Observable<UserChatRoom> {
    console.log(roomId);

    return this.baseApiService.getOne(
      `/chatrooms/${roomId}/user`,
      new HttpParams().append('userId', userId)
    );
  }

  changePassword(roomId: string, password: string): Observable<void> {
    return this.baseApiService.postOne(`/chatrooms/${roomId}/changepassword`, {
      password,
    });
  }

  changeRole(
    userId: number,
    roomId: string,
    role: 'ADMIN' | 'USER'
  ): Observable<UserChatRoom> {
    return this.baseApiService.postOne(`/chatrooms/${roomId}/changerole`, {
      userId,
      role,
    });
  }

  banUser(userId: number, roomId: string, time: Date): void {
    this.socket.emit('banUser', { userId, roomId, time });
  }

  muteUser(userId: number, roomId: string, time: Date): void {
    this.socket.emit('muteUser', { userId, roomId, time });
  }

  userBanned(): Observable<BanUserDto> {
    return this.socket.fromEvent<BanUserDto>('banned');
  }

  userMuted(): Observable<BanUserDto> {
    return this.socket.fromEvent<BanUserDto>('muted');
  }

  createDm(userId: number): Observable<Room> {
    return this.baseApiService.postOne('/chatrooms/dm', { otherId: userId });
  }

  getAllBlockedUsers(): Observable<User[]> {
    return this.baseApiService.getMany('/chatrooms/blocked');
  }

  resetConnection(): void {
    this.socket?.disconnect();
    this.socket.connect();
  }
}
