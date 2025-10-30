import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserMenuComponent } from './user-menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, RouterLink, RouterLinkActive, UserMenuComponent],
  template: `
    <mat-toolbar color="primary" class="header-toolbar">
      <span class="logo">CreaPrint</span>
      <span class="spacer"></span>
      <nav>
        <button mat-button routerLink="/" routerLinkActive="active">Accueil</button>
        <button mat-button routerLink="/articles" routerLinkActive="active">Articles</button>
  <button mat-button routerLink="/about" routerLinkActive="active">À propos</button>
  <button mat-button routerLink="/contact" routerLinkActive="active">Contact</button>
      </nav>
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
      font-size: 1.3rem;
      letter-spacing: 1px;
      user-select: none;
      color: var(--header-logo-color, #fff);
    }
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
export class HeaderComponent {}
