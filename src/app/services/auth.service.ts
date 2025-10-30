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
          // Try to read token from response body or data.token
          const token = resp?.data?.access_token || resp?.data?.token || resp?.data;
          if (typeof token === 'string' && token.length > 10) {
            TokenService.setToken(token);
          }
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
    // For now just clear local state. In a real app you'd also revoke tokens / call an API.
    this.authState.setLoggedIn(false);
  }
}
