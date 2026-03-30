import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'se_auth_token';

interface TokenPayload {
  sub: string;
  email: string;
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  get loginUrl(): string {
    return environment.loginAppUrl;
  }

  storeToken(token: string): void {
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  clearToken(): void {
    sessionStorage.removeItem(TOKEN_KEY);
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const payload = this.decodePayload(token);
    if (!payload) return false;
    return payload.exp * 1000 > Date.now();
  }

  getTokenPayload(): TokenPayload | null {
    const token = this.getToken();
    if (!token) return null;
    return this.decodePayload(token);
  }

  private decodePayload(token: string): TokenPayload | null {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }
}
