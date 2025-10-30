import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <div style="display:flex;justify-content:center;padding:2rem;">
      <mat-card style="width:100%;max-width:720px;padding:1rem;">
        <mat-card-title>Profil utilisateur</mat-card-title>
        <mat-card-content>
          <div *ngIf="auth.isLoggedInSignal()() ; else notLogged">
            <p>Bienvenue — vous êtes connecté.</p>
            <p>Actions disponibles :</p>
            <ul>
              <li><a (click)="go('/orders')">Voir les commandes passées</a></li>
              <li><a (click)="go('/cart')">Voir le panier</a></li>
              <li><a (click)="logout()">Se déconnecter</a></li>
            </ul>
          </div>
          <ng-template #notLogged>
            <p>Vous n'êtes pas connecté.</p>
            <button mat-flat-button color="primary" (click)="go('/login')">Aller à la page de connexion</button>
          </ng-template>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class ProfileComponent {
  constructor(public auth: AuthStateService, private router: Router) {}

  go(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.auth.setLoggedIn(false);
    this.router.navigate(['/']);
  }
}
