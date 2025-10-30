import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatToolbarModule],
  template: `
    <mat-toolbar color="primary" class="footer-toolbar">
      <span>&copy; {{ currentYear }} CreaPrint. Tous droits réservés.</span>
    </mat-toolbar>
  `,
  styles: [`
    .footer-toolbar {
      position: fixed;
      bottom: 0;
      width: 100%;
      z-index: 100;
      font-size: 0.95rem;
      justify-content: center;
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
