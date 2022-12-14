import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BaseApiService {
  private baseApi = environment.baseApi;

  constructor(private readonly http: HttpClient) {}

  getOne<T>(path: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(this.baseApi + path, {
      params,
    });
  }

  getMany<T>(path: string, params?: HttpParams): Observable<T[]> {
    return this.http.get<T[]>(this.baseApi + path, {
      params,
    });
  }

  postOne<T>(path: string, body?: any): Observable<T> {
    return this.http.post<T>(this.baseApi + path, body);
  }

  patchOne<T>(path: string, body?: any): Observable<T> {
    return this.http.patch<T>(this.baseApi + path, body);
  }

  deleteOne<T>(path: string): Observable<T> {
    return this.http.delete<T>(this.baseApi + path);
  }
}
