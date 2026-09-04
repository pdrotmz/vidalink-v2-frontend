import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserMeResponse } from '../models/user-me-response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  getMe(): Observable<UserMeResponse> {
    return this.http.get<UserMeResponse>('/api/users/me');
  }
}