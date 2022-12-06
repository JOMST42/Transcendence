import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../user/models';
import { ChatService } from './services';

@Injectable({
  providedIn: 'root',
})
export class BlockerUsersResolver implements Resolve<User[]> {
  constructor(private readonly chatService: ChatService) {}

  resolve(): Observable<User[]> {
    return this.chatService.getAllBlockedUsers();
  }
}
