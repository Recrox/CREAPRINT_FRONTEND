import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../../services/cart.service';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatButtonModule],
  template: `
    <div style="display:flex;justify-content:center;padding:2rem;">
      <mat-card style="width:100%;max-width:720px;padding:1rem;">
        <mat-card-title>Basket</mat-card-title>
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
                    <div style="font-weight:600">{{ it.title || it.name || it.article?.title || it.product?.title || it.articleTitle || it.productName || ('Article ' + (it.articleId || it.id || '')) }}</div>
                    <div style="font-size:.9rem;color:rgba(0,0,0,0.6)">ID: {{ it.articleId || it.id || it.itemId || '—' }}</div>
                    <div style="font-size:.9rem;color:rgba(0,0,0,0.6)">Quantité: {{ it.quantity || it.qty || 1 }}</div>
                    <div style="font-size:.95rem;color:rgba(0,0,0,0.8);margin-top:0.25rem">Prix: {{ (it.price ?? it.unitPrice ?? it.amount) ? ((it.price ?? it.unitPrice ?? it.amount) | number:'1.2-2') + ' €' : '—' }}</div>
                  </div>
                  <div>
                    <button mat-button color="warn" (click)="remove(it.id || it.itemId)">Supprimer</button>
                  </div>
                </div>
              </mat-list-item>
            </mat-list>
            <div *ngIf="!loading() && items().length === 0">Votre panier est vide.</div>
            <div *ngIf="!loading() && items().length">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1rem;">
                <div style="font-weight:600">Total :</div>
                <div style="font-size:1.05rem">{{ total() | number:'1.2-2' }} €</div>
              </div>
              <div style="display:flex;justify-content:flex-end;margin-top:0.5rem;">
                <button mat-flat-button color="primary" (click)="checkout()">Passer la commande</button>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class BasketComponent implements OnInit {
  items = signal<any[]>([]);
  loading = signal(false);
  total = signal<number>(0);

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
        console.log('Basket response:', b);
        const arr = Array.isArray(b?.items) ? b.items : Array.isArray(b) ? b : [];
        this.items.set(arr);
        // compute total
        try {
          const t = arr.reduce((acc: number, it: any) => {
            const price = (it.price ?? it.unitPrice ?? it.amount) || 0;
            const qty = (it.quantity || it.qty || 1) || 1;
            return acc + (Number(price) * Number(qty));
          }, 0);
          this.total.set(t);
        } catch {
          this.total.set(0);
        }
        this.loading.set(false);
      },
      error: () => {
        this.items.set([]);
        this.total.set(0);
        this.loading.set(false);
      }
    });
  }

  remove(itemId: number | undefined) {
    if (!itemId) return;
    this.cart.removeItem(itemId).subscribe({ next: () => this.load(), error: () => this.load() });
  }

  goToLogin() {
    (window as any).location.href = '/login';
  }

  checkout() {
    // navigate to orders page if present
    try {
      (window as any).location.href = '/orders';
    } catch {
      alert('Passage de commande non disponible');
    }
  }
}
