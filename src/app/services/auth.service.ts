import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthRequest, AuthResponse } from '../models/auth.model';
import { environment } from '../../environments/environment';

const TOKEN_KEY = environment.tokenKey;
const REFRESH_TOKEN_KEY = environment.refreshTokenKey;
const USER_KEY = environment.userKey;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  readonly currentUser = signal<AuthResponse['user'] | null>(this.loadUser());

  private loadUser(): AuthResponse['user'] | null {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthResponse['user']) : null;
  }

  login(credentials: AuthRequest) {
    return this.http.post<AuthResponse>('/api/auth/login', credentials).pipe(
      tap((res) => {
        this.storeTokens(res.token, res.refreshToken);
        sessionStorage.setItem(USER_KEY, JSON.stringify(res.user));
        this.currentUser.set(res.user);
      }),
    );
  }

  refresh(): Observable<{ token: string; refreshToken: string }> {
    const refreshToken = this.getRefreshToken();
    return this.http
      .post<{ token: string; refreshToken: string }>('/api/auth/refresh', { refreshToken })
      .pipe(tap((res) => this.storeTokens(res.token, res.refreshToken)));
  }

  storeTokens(token: string, refreshToken: string): void {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  logout(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /** Returns true if the token is expired or will expire within bufferSeconds */
  isTokenExpired(token: string, bufferSeconds = 30): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as { exp: number };
      return Date.now() / 1000 >= payload.exp - bufferSeconds;
    } catch {
      return true;
    }
  }
}
