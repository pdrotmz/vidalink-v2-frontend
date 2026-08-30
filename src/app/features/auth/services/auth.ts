import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { RegisterRequest } from '../models/register-request';
import { Observable } from 'rxjs';
import { RegisterResponse } from '../models/register-response';
import { LoginResponse } from '../models/login-response';
import { LoginRequest } from '../models/login-request';
import { MeResponse } from '../models/me-response';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly http = inject(HttpClient);

    register(request: RegisterRequest): Observable<RegisterResponse> {
        return this.http.post<RegisterResponse>('/api/auth/register', request);
    }

    login(request: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>('/api/auth/login', request);
    }

    me(): Observable<MeResponse> {
        return this.http.get<MeResponse>('/api/users/me');
    }
}
