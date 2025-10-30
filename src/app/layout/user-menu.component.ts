import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule, MatDividerModule],
  template: `
    <div>
      <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="User menu">
        <mat-icon>account_circle</mat-icon>
      </button>

      <mat-menu #menu="matMenu">
        <ng-container *ngIf="auth.isLoggedInSignal()() ; else loggedOut">
          <button mat-menu-item (click)="goTo('/orders')">
            <mat-icon>receipt_long</mat-icon>
            <span>Commandes passées</span>
          </button>
          <button mat-menu-item (click)="goTo('/cart')">
            <mat-icon>shopping_cart</mat-icon>
            <span>Panier</span>
          </button>
          <button mat-menu-item (click)="goTo('/profile')">
            <mat-icon>person</mat-icon>
            <span>Profil</span>
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Se déconnecter</span>
          </button>
        </ng-container>

        <ng-template #loggedOut>
          <button mat-menu-item (click)="goTo('/login')">
            <mat-icon>login</mat-icon>
            <span>Se connecter</span>
          </button>
        </ng-template>
      </mat-menu>
    </div>
  `
})
export class UserMenuComponent {
  constructor(public auth: AuthStateService, private router: Router) {}

  goTo(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.auth.setLoggedIn(false);
    this.router.navigate(['/']);
  }
}
