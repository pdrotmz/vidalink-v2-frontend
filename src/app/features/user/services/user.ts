import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserMeResponse } from '../models/user-me-response';
import { environmentProd } from '../../../../environments/environment.prod';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  getMe(): Observable<UserMeResponse> {
    return this.http.get<UserMeResponse>(`${environmentProd.apiUrl}/api/users/me`);
  }
}