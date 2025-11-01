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
}
