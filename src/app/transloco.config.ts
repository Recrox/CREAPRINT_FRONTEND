import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { translocoConfig, TranslocoLoader, provideTransloco } from '@ngneat/transloco';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class HttpTranslocoLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {}
  getTranslation(lang: string): Observable<Record<string, any>> {
    const url = `assets/i18n/${lang}.json`;
    return this.http.get<Record<string, any>>(url).pipe(
      catchError(err => {
        // Log a clearer message for debugging (network / 404 / permission issues)
        console.error(`[Transloco] Failed to load translations from ${url}:`, err);
        // Return an empty object so the app can continue; the pipe will show keys until files are fixed
        return of({});
      })
    );
  }
}

export const translocoProviders = provideTransloco({
  loader: HttpTranslocoLoader,
  config: {
    availableLangs: ['en', 'fr', 'de', 'nl'],
    defaultLang: 'fr',
    // Provide a fallback language to try if the requested language fails
    fallbackLang: 'en',
    reRenderOnLangChange: true,
    prodMode: false,
  }
});
