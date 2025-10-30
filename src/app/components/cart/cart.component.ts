import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../../services/cart.service';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatButtonModule],
  template: `
    <div style="display:flex;justify-content:center;padding:2rem;">
      <mat-card style="width:100%;max-width:720px;padding:1rem;">
        <mat-card-title>Votre panier</mat-card-title>
        <mat-card-content>
          <div *ngIf="!auth.isLoggedInSignal()()">
            <p>Vous devez être connecté pour voir votre panier.</p>
            <button mat-flat-button color="primary" (click)="goToLogin()">Se connecter</button>
          </div>

          <div *ngIf="auth.isLoggedInSignal()()">
            <div *ngIf="loading()">Chargement...</div>
            <mat-list *ngIf="!loading() && items().length">
              <mat-list-item *ngFor="let it of items()">
                <div style="display:flex;align-items:center;justify-content:space-between;width:100%">
                  <div>
                    <div style="font-weight:600">{{ it.title || it.name || ('Article ' + (it.articleId || it.id || '')) }}</div>
                    <div style="font-size:.9rem;color:rgba(0,0,0,0.6)">Quantité: {{ it.quantity || it.qty || 1 }}</div>
                  </div>
                  <div>
                    <button mat-button color="warn" (click)="remove(it.id || it.itemId)">Supprimer</button>
                  </div>
                </div>
              </mat-list-item>
            </mat-list>
            <div *ngIf="!loading() && items().length === 0">Votre panier est vide.</div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class CartComponent implements OnInit {
  items = signal<any[]>([]);
  loading = signal(false);

  constructor(private cart: CartService, public auth: AuthStateService) {}

  ngOnInit(): void {
    if (this.auth.isLoggedInSignal()()) {
      this.load();
    }
  }

  load() {
    this.loading.set(true);
    this.cart.getBasket().subscribe({
      next: (b: any) => {
        // attempt to parse items from response
        const arr = Array.isArray(b?.items) ? b.items : Array.isArray(b) ? b : [];
        this.items.set(arr);
        this.loading.set(false);
      },
      error: () => {
        this.items.set([]);
        this.loading.set(false);
      }
    });
  }

  remove(itemId: number | undefined) {
    if (!itemId) return;
    this.cart.removeItem(itemId).subscribe({
      next: () => this.load(),
      error: () => this.load()
    });
  }

  goToLogin() {
    (window as any).location.href = '/login';
  }
}
