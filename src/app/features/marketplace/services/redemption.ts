import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateRedemptionRequest } from '../models/create-redemption-request';
import { Redemption } from '../models/redemption';

@Injectable({
  providedIn: 'root',
})
export class RedemptionService {
  private readonly http = inject(HttpClient);

  redeem(request: CreateRedemptionRequest): Observable<Redemption> {
    return this.http.post<Redemption>(
      '/api/redemptions/redeem',
      request
    );
  }
}