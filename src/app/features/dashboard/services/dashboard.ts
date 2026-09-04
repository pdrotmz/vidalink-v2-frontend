  import { Injectable, inject } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';

  import { UserPointsResponse } from '../models/user-points-response';
  import { UserLevelResponse } from '../models/user-level-response';
  import { UserBadgeResponse } from '../models/user-badge-response';
  import { PointTransactionResponse } from '../models/point-transaction-response';
  import { environmentProd } from '../../../../environments/environment.prod';
  @Injectable({
    providedIn: 'root',
  })
  export class DashboardService {

    private readonly http = inject(HttpClient);

    getPoints(): Observable<UserPointsResponse> {
      return this.http.get<UserPointsResponse>(
        `${environmentProd.apiUrl}/api/points/me`
      );
    }

    getLevel(): Observable<UserLevelResponse> {
      return this.http.get<UserLevelResponse>(
        `${environmentProd.apiUrl}/api/points/me/level`
      );
    }

    getBadges(): Observable<UserBadgeResponse[]> {
      return this.http.get<UserBadgeResponse[]>(
        `${environmentProd.apiUrl}/api/points/me/badges`
      );
    }

    getTransactions(): Observable<PointTransactionResponse[]> {
      return this.http.get<PointTransactionResponse[]>(
        `${environmentProd.apiUrl}/api/points/me/transactions`
      );
    }
  }