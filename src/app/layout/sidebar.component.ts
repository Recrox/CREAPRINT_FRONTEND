import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { NavService } from '../services/nav.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatListModule, RouterLink, RouterLinkActive],
  template: `
    <mat-sidenav-container class="sidebar-container">
      <mat-sidenav mode="side" opened class="sidebar">
        <mat-nav-list>
          <a mat-list-item [routerLink]="nav.route()" routerLinkActive="active">Accueil</a>
          <a mat-list-item [routerLink]="nav.route('articles')" routerLinkActive="active">Articles</a>
          <a mat-list-item [routerLink]="nav.route('about')" routerLinkActive="active">À propos</a>
          <a mat-list-item [routerLink]="nav.route('contact')" routerLinkActive="active">Contact</a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <ng-content></ng-content>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidebar-container {
      /* let the parent decide the available height; provide a sensible fallback */
      height: 100%;
      min-height: calc(100vh - 112px); /* match app wrapper (header + footer) */
      box-sizing: border-box;
    }
    .sidebar {
      width: 200px;
      background: #fafafa; /* restored original light background */
      border-right: 1px solid #eee;
      height: 100%; /* ensure background fills the container vertically */
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }
    mat-nav-list { padding: 0; }
    a[mat-list-item] {
      color: rgba(0,0,0,0.85);
      padding: 0.4rem 0.75rem;
      border-radius: 4px;
      margin: 0.1rem 0;
      transition: background-color .12s ease, color .12s ease;
      display: flex;
      align-items: center;
    }
    a[mat-list-item]:hover {
      background: rgba(0,0,0,0.04);
      color: rgba(0,0,0,0.9);
    }
    a[mat-list-item].active {
      font-weight: 600;
      color: #1976d2;
      background: rgba(25,118,210,0.06);
    }

    /* Alternate dark theme (commented). To enable, replace .sidebar background and link colors above.
  body.dark-theme .sidebar { background: linear-gradient(180deg,#0f172a 0%, #082032 100%); }
  body.dark-theme a[mat-list-item] { color: #e6eef6; }
  body.dark-theme a[mat-list-item]:hover { background: rgba(255,255,255,0.04); color: #fff; }
  body.dark-theme a[mat-list-item].active { background: linear-gradient(90deg, rgba(16,185,129,0.06), rgba(59,130,246,0.03)); color: #a5f3fc; }
    */
    mat-sidenav-content, .mat-sidenav-content {
      min-height: 100%;
    }
  `]
})
export class SidebarComponent {
  constructor(public transloco: TranslocoService, public nav: NavService) {}
}
