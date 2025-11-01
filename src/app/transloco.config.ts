import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { translocoConfig, TranslocoLoader, provideTransloco } from '@ngneat/transloco';
import { Observable } from 'rxjs';

@Injectable()
export class HttpTranslocoLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {}
  getTranslation(lang: string): Observable<Record<string, any>> {
    return this.http.get<Record<string, any>>(`assets/i18n/${lang}.json`);
  }
}

export const translocoProviders = provideTransloco({
  loader: HttpTranslocoLoader,
  config: {
    availableLangs: ['en', 'fr', 'de', 'nl'],
    defaultLang: 'fr',
    reRenderOnLangChange: true,
    prodMode: false,
  }
});
