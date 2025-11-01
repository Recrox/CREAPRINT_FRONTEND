import { Injectable, signal } from '@angular/core';
import { TokenService } from './http.service';

/**
 * Small in-memory auth state for UI wiring. It reads an existing token from localStorage
 * at startup so the UI remains logged in across page reloads when a token is present.
 */
@Injectable({ providedIn: 'root' })
export class AuthStateService {
  // initialize from TokenService presence
  private _isLoggedIn = signal<boolean>(!!TokenService.getToken());

  constructor() {
    // listen for token change events (dispatched by TokenService)
    try {
      window.addEventListener('auth-token-changed', (e: any) => {
        const token = e?.detail?.token;
        this._isLoggedIn.set(!!token);
      });
    } catch {}
  }

  isLoggedIn() {
    return this._isLoggedIn();
  }

  isLoggedInSignal() {
    return this._isLoggedIn;
  }

  setLoggedIn(value: boolean) {
    this._isLoggedIn.set(value);
  }
}
