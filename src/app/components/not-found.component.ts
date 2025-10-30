import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  template: `
    <div class="nf-root">
      <div class="nf-card">
        <div class="nf-code">404</div>
        <div class="nf-body">
          <h2>Oups — page introuvable</h2>
          <p>La page que vous cherchez n'existe pas ou a été déplacée. Vérifiez l'URL ou revenez à l'accueil.</p>
          <div class="actions">
            <a mat-stroked-button class="btn" routerLink="/">Retour à l'accueil</a>
            <a mat-flat-button class="btn primary" color="primary" routerLink="/articles">Voir les articles</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
  .nf-root { display:flex; align-items:center; justify-content:center; padding:4rem 1rem; min-height: calc(100vh - 112px); }
  /* lift the card more to position it higher on the page */
  .nf-card { display:flex; gap:2rem; align-items:center; justify-content:center; text-align:left; width:100%; max-width:980px; padding:2.5rem; border-radius:14px; box-shadow:0 10px 40px rgba(7,17,27,0.12); background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(248,250,252,0.95)); transform: translateY(-12vh); transition: transform .18s ease; }
    .nf-code { font-size:6.5rem; font-weight:800; line-height:1; color: #0f172a; background: linear-gradient(90deg,#1976d2,#00bcd4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .nf-body { max-width:640px; }
    .nf-body h2 { margin:0 0 0.5rem; font-size:1.6rem; color: #0b3147; }
    .nf-body p { margin:0 0 1rem; color: rgba(7,17,27,0.7); }
    .actions { display:flex; gap:0.75rem; margin-top:0.5rem; }
    .actions .btn { border-radius:8px; padding:0.5rem 0.9rem; }
    .actions .btn.primary { box-shadow: 0 6px 18px rgba(25,118,210,0.12); }
    .actions a:hover { transform: translateY(-2px); }
  @media (max-width:900px) { .nf-card { flex-direction:column; text-align:center; padding:2rem; transform: translateY(-8vh); } .nf-body { max-width:100%; } .nf-code { font-size:4.25rem; } .actions { justify-content:center; } }
    `
  ]
})
export class NotFoundComponent {}
