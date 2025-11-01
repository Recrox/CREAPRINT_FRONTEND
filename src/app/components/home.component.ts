import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  template: `
    <section class="hero">
      <div class="hero-inner">
        <h1>CreaPrint</h1>
        <p class="lead">Imprimez vos idées. Publiez et gérez vos articles en quelques clics.</p>
        <div class="hero-ctas">
          <a mat-flat-button color="primary" [routerLink]="['/', transloco.getActiveLang() || 'fr', 'articles']">Voir les articles</a>
          <a mat-stroked-button color="primary" [routerLink]="['/', transloco.getActiveLang() || 'fr', 'articles', 'new']">Créer un article</a>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="feature">
        <mat-icon>speed</mat-icon>
        <h3>Rapide</h3>
        <p>Interface fluide pour gérer vos articles rapidement.</p>
      </div>
      <div class="feature">
        <mat-icon>security</mat-icon>
        <h3>Sécurisé</h3>
        <p>Authentification et gestion des accès intégrées.</p>
      </div>
      <div class="feature">
        <mat-icon>support</mat-icon>
        <h3>Support</h3>
        <p>Nous fournissons des outils et une API prête à l'emploi.</p>
      </div>
    </section>

    <section class="preview">
      <mat-card>
        <mat-card-title>Articles récents</mat-card-title>
        <mat-card-content>
          <p>Consultez la liste complète des articles et découvrez-en quelques-uns.</p>
          <div class="preview-actions">
            <a mat-button [routerLink]="['/', transloco.getActiveLang() || 'fr', 'articles']">Voir tous les articles</a>
          </div>
        </mat-card-content>
      </mat-card>
    </section>
  `,
  styles: [`
    :host { display:block; }
    .hero { background: linear-gradient(90deg, #e6f4ff 0%, #f7fbff 100%); padding: 3rem 1rem; text-align:center; }
    .hero-inner { max-width:1000px; margin:0 auto; }
    .hero h1 { font-size:2.25rem; margin:0 0 0.5rem; }
    .lead { color: rgba(0,0,0,0.7); margin:0 0 1rem; }
    .hero-ctas a { margin:0 .5rem; }

    .features { display:flex; gap:1rem; max-width:1000px; margin:2rem auto; padding:0 1rem; }
    .feature { flex:1; background:#fff; border-radius:8px; padding:1.25rem; box-shadow:0 1px 6px rgba(0,0,0,0.06); text-align:center; }
    .feature mat-icon { font-size:36px; color:#1976d2; }
    .feature h3 { margin:0.5rem 0; }

    .preview { max-width:1000px; margin:2rem auto; padding:0 1rem; }
    .preview mat-card { padding:1rem; }
    .preview-actions { margin-top:1rem; }

    /* Responsive */
    @media (max-width:800px) {
      .features { flex-direction:column; }
      .hero h1 { font-size:1.6rem; }
    }
  `]
})
export class HomeComponent { constructor(public transloco: TranslocoService) {} }
