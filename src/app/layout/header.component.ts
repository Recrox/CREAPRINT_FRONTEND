import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserMenuComponent } from './user-menu.component';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, RouterLink, RouterLinkActive, UserMenuComponent],
  template: `
    <mat-toolbar color="primary" class="header-toolbar">
      <a class="logo" routerLink="/" aria-label="Accueil">
        <svg class="logo-ico" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="#fff" fill-opacity="0.06"></rect>
          <path d="M6 8 L11 13 L6 18 L2 14 L6 8 Z" fill="#fff" opacity="0.95" />
          <circle cx="17" cy="12" r="3" fill="#fff" opacity="0.95" />
        </svg>
        CreaPrint
      </a>
      <span class="spacer"></span>
      <nav>
        <button mat-button routerLink="/" routerLinkActive="active">Accueil</button>
        <button mat-button routerLink="/articles" routerLinkActive="active">Articles</button>
        <button mat-button routerLink="/about" routerLinkActive="active">À propos</button>
        <button mat-button routerLink="/contact" routerLinkActive="active">Contact</button>
      </nav>
      <button mat-icon-button aria-label="Toggle theme" (click)="theme.toggle()">
        <mat-icon>brightness_6</mat-icon>
      </button>
      <app-user-menu></app-user-menu>
    </mat-toolbar>
  `,
  styles: [`
    .header-toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      gap: 0.75rem;
    }
    .logo {
      font-weight: bold;
      font-size: 1.15rem;
      letter-spacing: 1px;
      user-select: none;
      color: var(--header-logo-color, #fff);
      display:inline-flex; align-items:center; gap:0.5rem;
      text-decoration: none; /* remove anchor underline */
      cursor: pointer;
    }
    .logo:hover,
    .logo:focus {
      text-decoration: none;
      outline: none; /* preserve visual focus styles from Material, avoid double outlines */
    }
    .logo-ico { filter: drop-shadow(0 1px 0 rgba(0,0,0,0.15)); }
    .spacer {
      flex: 1 1 auto;
    }
    /* Simpler, theme-friendly header styles */
    nav button {
      color: inherit; /* use toolbar contrast color */
      font-weight: 500;
      text-transform: none;
      letter-spacing: .4px;
      transition: background .12s ease;
      border-radius: 6px;
      padding: 0 .7rem;
      min-width: 64px;
    }
    nav button:hover:not(.active) {
      background: rgba(255,255,255,0.08);
    }
    nav button.active {
      font-weight: 600;
      background: rgba(255,255,255,0.12);
    }
    /* Keep toolbar color controlled by Material theme (mat-toolbar color="primary") */
    .header-toolbar {
      padding-left: 1rem;
      padding-right: 1rem;
      align-items: center;
    }
  `]
})
export class HeaderComponent {
  constructor(public theme: ThemeService) {}
}
