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

  getById<T>(path: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(
      this.baseApi + path,
      params ? { params } : undefined
    );
  }

  getMany<T>(path: string, params?: HttpParams): Observable<T[]> {
    return this.http.get<T[]>(
      this.baseApi + path,
      params ? { params } : undefined
    );
  }
}
