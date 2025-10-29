import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
  <mat-card class="about-card" style="padding:2rem;">
      <mat-card-title>À propos</mat-card-title>
      <mat-card-content>
        <p>
          Bienvenue sur CreaPrint ! Cette application vous permet de gérer vos articles facilement avec Angular et NSwag.
        </p>
        <p>
          Version Angular: 20<br>
          UI: Angular Material<br>
          Backend: Swagger API via NSwag
        </p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .about-card {
      max-width: 500px;
      margin: 2rem auto;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
  `]
})
export class AboutComponent {}
