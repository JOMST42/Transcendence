import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApiService } from '../../core/services';
import { Game } from '../models';

@Injectable({
  providedIn: 'root',
})
export class WatchService {
  constructor(private readonly baseApiService: BaseApiService) {}

  getGameById(id: number): Observable<Game> {
    return this.baseApiService.getOne(`/games/${id}`);
  }

	getGames(): Observable<Game[]> {
    return this.baseApiService.getOne(`/games/all`);
  }

	getGamesByUserId(id: number): Observable<Game[]> {
    return this.baseApiService.getOne(`/games/${id}/all`);
	}

	getGamesPlayedByUsers(id1: number, id2: number): Observable<Game[]> {
    return this.baseApiService.getOne(`/games/${id1}/vs/${id2}`);
  }

	getGamesWonByUserId(id: number): Observable<Game[]> {
    return this.baseApiService.getOne(`/games/${id}/won`);
  }

  getGamesLostByUserId(id: number): Observable<Game[]> {
    return this.baseApiService.getOne(`/games/${id}/lost`);
  }
}
