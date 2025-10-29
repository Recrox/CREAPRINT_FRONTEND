import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, RouterLink, RouterLinkActive],
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
    </mat-toolbar>
  `,
  styles: [`
    .header-toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .logo {
      font-weight: bold;
      font-size: 1.3rem;
      letter-spacing: 1px;
    }
    .spacer {
      flex: 1 1 auto;
    }
    nav button.active {
      font-weight: bold;
      color: #fff;
      background: rgba(255,255,255,0.1);
    }
  `]
})
export class HeaderComponent {}
