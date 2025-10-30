import { Injectable, signal } from '@angular/core';

/**
 * Small in-memory auth state for UI wiring. Real apps should persist tokens and use interceptors.
 */
@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private _isLoggedIn = signal(false);

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
