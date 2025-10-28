import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

if (typeof process !== 'undefined' && process && process.env && process.env.NODE_ENV === 'production') {
  enableProdMode();
}

bootstrapApplication(AppComponent).catch(err => console.error(err));
