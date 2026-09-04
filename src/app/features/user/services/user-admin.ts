import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../models/user';
import { environmentProd } from '../../../../environments/environment.prod';
@Injectable({
  providedIn: 'root',
})
export class UserAdminService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${environmentProd.apiUrl}/api/users`);
  }
}