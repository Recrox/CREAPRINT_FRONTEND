import { Injectable } from '@angular/core';
import * as apiClient from '../api-client';
import { environment } from '../../environments/environment';
import { from, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthStateService } from './auth-state.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private client: apiClient.apiClient.ApiClient;

  constructor(private authState: AuthStateService) {
    this.client = new apiClient.apiClient.ApiClient(environment.apiBaseUrl);
  }

  /**
   * Attempt to authenticate using the generated ApiClient. On success, set logged-in state.
   */
  login(username: string, password: string): Observable<void> {
    const req = new apiClient.apiClient.LoginRequest({ username, password });
    return from(this.client.authenticate(req)).pipe(
      tap(() => this.authState.setLoggedIn(true)),
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
