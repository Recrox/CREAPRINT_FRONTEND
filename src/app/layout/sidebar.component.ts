import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatListModule, RouterLink, RouterLinkActive],
  template: `
    <mat-sidenav-container class="sidebar-container">
      <mat-sidenav mode="side" opened class="sidebar">
        <mat-nav-list>
          <a mat-list-item routerLink="/" routerLinkActive="active">Accueil</a>
          <a mat-list-item routerLink="/articles" routerLinkActive="active">Articles</a>
          <a mat-list-item routerLink="/about" routerLinkActive="active">À propos</a>
          <a mat-list-item routerLink="/contact" routerLinkActive="active">Contact</a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <ng-content></ng-content>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidebar-container {
      height: calc(100vh - 64px - 48px); /* header/footer height */
      min-height: 400px;
    }
    .sidebar {
      width: 200px;
      background: #fafafa;
      border-right: 1px solid #eee;
    }
    .active {
      font-weight: bold;
      color: #1976d2;
    }
  `]
})
export class SidebarComponent {}
