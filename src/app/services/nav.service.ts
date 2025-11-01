import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NavService {
  constructor(private transloco: TranslocoService) {}

  // returns an array suitable for Router.navigate or routerLink
  route(...parts: string[]): any[] {
    const lang = this.transloco.getActiveLang() || environment.defaultLang;
    return ['/', lang, ...parts.filter(p => !!p)];
  }

  // helper to build a url string (useful for router.navigateByUrl)
  url(...parts: string[]): string {
    const lang = this.transloco.getActiveLang() || environment.defaultLang;
    return '/' + [lang, ...parts.filter(p => !!p)].join('/');
  }

  // convenience: navigate using router
  navigate(router: Router, ...parts: string[]) {
    return router.navigate(this.route(...parts));
  }

  // convenience: accept a path string (absolute or relative) and navigate to it
  // normalizes leading slash and splits into parts before delegating to navigate()
  navigateTo(router: Router, path?: string) {
    if (!path) return this.navigate(router);
    const normalized = path.startsWith('/') ? path.slice(1) : path;
    const parts = normalized ? normalized.split('/').filter(p => !!p) : [];
    return this.navigate(router, ...parts);
  }
}
