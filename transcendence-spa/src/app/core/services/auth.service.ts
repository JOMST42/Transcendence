import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly baseApiService: BaseApiService) {}

  refreshToken(): Observable<void> {
    return this.baseApiService.getOne('/auth/refresh-token');
  }
}
