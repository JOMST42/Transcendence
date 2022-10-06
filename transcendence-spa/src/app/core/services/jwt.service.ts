import { Injectable } from '@angular/core';
import jwt_decode, { JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  constructor() {}

  decodeToken(token: string): JwtPayload {
    return jwt_decode(token);
  }

  isExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload.exp) {
      return true;
    }

    const now = Date.now().valueOf() / 1000;
    return now > payload.exp;
  }
}
