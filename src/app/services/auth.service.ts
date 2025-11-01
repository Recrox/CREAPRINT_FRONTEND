import { Injectable } from '@angular/core';
import * as apiClient from '../api-client';
import { environment } from '../../environments/environment';
import { from, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthStateService } from './auth-state.service';
import { sharedAxiosInstance, TokenService } from './http.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private client: apiClient.apiClient.ApiClient;

  constructor(private authState: AuthStateService) {
    this.client = new apiClient.apiClient.ApiClient(environment.apiBaseUrl, sharedAxiosInstance);
  }

  /**
   * Quick session check: attempt to call an endpoint that requires auth. If it succeeds,
   * mark the UI as logged in. This helps keep the UI logged in across page reloads when
   * the server uses cookie-based sessions or when a token is present.
   */
  async checkAuth(): Promise<boolean> {
    // If a token exists in storage, mark logged in immediately
    if (TokenService.getToken()) {
      this.authState.setLoggedIn(true);
      return true;
    }

    try {
      // Try a common endpoint - /api/User/me. If backend doesn't expose it, this will fail silently.
      await sharedAxiosInstance.get(environment.apiBaseUrl + '/api/User/me');
      this.authState.setLoggedIn(true);
      return true;
    } catch (e) {
      // not authenticated
      this.authState.setLoggedIn(false);
      return false;
    }
  }

  /**
   * Attempt to authenticate using the generated ApiClient. On success, set logged-in state.
   */
  login(username: string, password: string): Observable<void> {
    const req = new apiClient.apiClient.LoginRequest({ username, password });
    // First attempt: call authenticate via generated client
    return from(this.client.authenticate(req)).pipe(
      // After authenticate, attempt to fetch a token from the /api/User/token endpoint
      tap(async () => {
        try {
          const form = new URLSearchParams();
          form.append('username', username);
          form.append('password', password);
          const resp = await sharedAxiosInstance.post(environment.apiBaseUrl + '/api/User/token', form.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          });
          // Try to read token(s) from response body
          const data = resp?.data || {};
          const access = data?.access_token || data?.token || data?.accessToken || data;
          const refresh = data?.refresh_token || data?.refreshToken || data?.refresh;
          if (typeof access === 'string' && access.length > 10) TokenService.setToken(access);
          if (typeof refresh === 'string') TokenService.setRefreshToken(refresh);
        } catch (e) {
          // ignore token fetch errors — authenticate may still have set cookie-based auth
        }
        this.authState.setLoggedIn(true);
      }),
      catchError((err) => {
        this.authState.setLoggedIn(false);
        throw err;
      })
    );
  }

  logout(): void {
    // Clear token and local state.
    try { TokenService.setToken(null); TokenService.setRefreshToken(null); } catch {}
    this.authState.setLoggedIn(false);
  }
}
