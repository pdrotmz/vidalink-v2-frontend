import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {

  private readonly tokenKey = 'vidalink_token';

  save(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  get(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  remove(): void {
    localStorage.removeItem(this.tokenKey);
  }
}