import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card class="home-card">
      <mat-card-title>Accueil</mat-card-title>
      <mat-card-content>
        <h2>Bienvenue sur CreaPrint !</h2>
        <p>
          Gérez vos articles facilement avec Angular, Material et NSwag.<br>
          Utilisez le menu pour naviguer dans l'application.
        </p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .home-card {
      max-width: 500px;
      margin: 2rem auto;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
    }
  `]
})
export class HomeComponent {}
