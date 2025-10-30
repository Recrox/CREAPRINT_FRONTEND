import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <footer class="footer-root">
      <div class="footer-inner">
        <div class="col brand">
          <div class="logo">CreaPrint</div>
          <p class="tag">Imprimez vos idées. Livraison rapide.</p>
          <div class="social">
            <button mat-icon-button aria-label="Facebook"><mat-icon>facebook</mat-icon></button>
            <button mat-icon-button aria-label="Twitter"><mat-icon>twitter</mat-icon></button>
            <button mat-icon-button aria-label="Instagram"><mat-icon>photo_camera</mat-icon></button>
          </div>
        </div>

        <div class="col links">
          <h4>Liens utiles</h4>
          <ul>
            <li><a routerLink="/">Accueil</a></li>
            <li><a routerLink="/articles">Articles</a></li>
            <li><a routerLink="/contact">Contact</a></li>
            <li><a routerLink="/profile">Mon compte</a></li>
          </ul>
        </div>

        <div class="col newsletter">
          <h4>Newsletter</h4>
          <p>Recevez nos promotions et nouveautés.</p>
          <div class="newsletter-form">
            <mat-form-field appearance="outline">
              <input matInput placeholder="Votre email" />
            </mat-form-field>
            <button mat-flat-button color="primary">S'abonner</button>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <span>&copy; {{ currentYear }} CreaPrint</span>
        <span class="spacer"></span>
        <span>Made with ♥</span>
      </div>
    </footer>
  `,
  styles: [
    `
    .footer-root { background: linear-gradient(180deg, #f8fafc, #f1f5f9); color: #263238; padding: 2rem 1rem 1rem; border-top: 1px solid rgba(0,0,0,0.06); }
    .footer-inner { display:flex; gap:2rem; max-width:1200px; margin:0 auto; }
    .col { flex:1; min-width:200px; }
    .brand .logo { font-weight:700; font-size:1.25rem; }
    .brand .tag { margin:0.25rem 0 1rem 0; color:rgba(0,0,0,0.6); }
    .social button { margin-right:0.25rem; }
    .links ul { list-style:none; padding:0; margin:0; }
    .links li { margin:0.35rem 0; }
    .links a { color:inherit; text-decoration:none; opacity:0.9; }
    .newsletter .newsletter-form { display:flex; gap:0.5rem; align-items:center; }
    mat-form-field { flex:1; }
    .footer-bottom { max-width:1200px; margin:1rem auto 0; display:flex; align-items:center; color:rgba(0,0,0,0.6); }
    .spacer { flex:1; }

    /* Responsive */
    @media (max-width:900px) {
      .footer-inner { flex-direction:column; }
      .newsletter .newsletter-form { flex-direction:column; align-items:stretch; }
      mat-form-field { width:100%; }
    }
    `
  ]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
