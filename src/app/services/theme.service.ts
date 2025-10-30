import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _isDark = new BehaviorSubject<boolean>(false);
  readonly isDark$ = this._isDark.asObservable();

  constructor() {
    try {
      const saved = localStorage.getItem('theme');
      const isDark = saved === 'dark';
      this._isDark.next(isDark);
      this.applyClass(isDark);
    } catch {
      // ignore (e.g., SSR or storage blocked)
    }
  }

  toggle() {
    const next = !this._isDark.getValue();
    this._isDark.next(next);
    this.applyClass(next);
    try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch {}
  }

  setDark(dark: boolean) {
    this._isDark.next(dark);
    this.applyClass(dark);
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch {}
  }

  private applyClass(dark: boolean) {
    if (typeof document === 'undefined') return;
    const body = document.body;
    if (dark) body.classList.add('dark-theme'); else body.classList.remove('dark-theme');
  }
}
