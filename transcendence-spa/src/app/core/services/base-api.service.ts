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
      withCredentials: true,
    });
  }

  getMany<T>(path: string, params?: HttpParams): Observable<T[]> {
    return this.http.get<T[]>(this.baseApi + path, {
      params,
      withCredentials: true,
    });
  }
}
