import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';
import { take } from 'rxjs/operators';
import { BasketService } from '../../services/basket.service';
import { AuthStateService } from '../../services/auth-state.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import * as apiClient from '../../api-client';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule, TranslocoModule],
  template: `
    <mat-card class="basket-card">
      <div class="card-header">
        <div class="title">Votre panier</div>
        <div class="subtitle">{{ items().length }} article{{ items().length > 1 ? 's' : '' }}</div>
      </div>

      <div class="content">
        <div *ngIf="!auth.isLoggedInSignal()()" class="not-logged">
          <p>Vous devez être connecté pour voir votre panier.</p>
          <button mat-flat-button color="primary" (click)="goToLogin()">Se connecter</button>
        </div>

        <div *ngIf="auth.isLoggedInSignal()()">
          <div *ngIf="loading()" class="loading">
            <mat-progress-spinner mode="indeterminate" diameter="48"></mat-progress-spinner>
          </div>

          <div *ngIf="!loading() && items().length === 0" class="empty">
            <div class="empty-illustration">🧺</div>
            <div class="empty-text">Votre panier est vide</div>
          </div>

          <div *ngIf="!loading() && items().length > 0" class="items">
            <div class="item-row" *ngFor="let it of items()">
              <div class="thumb">
                <img *ngIf="imageFor(it.article); else placeholder" [src]="imageFor(it.article)" [alt]="it.article?.title" />
                <ng-template #placeholder>
                  <div class="thumb-placeholder"><mat-icon>image</mat-icon></div>
                </ng-template>
              </div>

              <div class="details">
                <div class="name">{{ it.article?.title || ('Article ' + (it.articleId || it.id || '')) }}</div>
                <div class="meta">ID: <span class="mono">{{ it.articleId || it.id }}</span></div>
                <div class="price-small">Prix unitaire: {{ unitPriceOf(it) | number:'1.2-2' }} €</div>
              </div>

              <div class="controls">
                <div class="qty-controls">
                  <button mat-mini-button (click)="decrement(it)"><mat-icon>remove</mat-icon></button>
                  <div class="qty-display">{{ quantityOf(it) }}</div>
                  <button mat-mini-button (click)="increment(it)"><mat-icon>add</mat-icon></button>
                </div>

                <div class="line-price">{{ linePriceOf(it) | number:'1.2-2' }} €</div>
                <div class="row-actions">
                  <button class="fav-btn" mat-icon-button aria-label="Ajouter aux favoris" title="Ajouter aux favoris">
                    <mat-icon>star_border</mat-icon>
                  </button>
                    <button class="delete-btn" mat-icon-button aria-label="Supprimer" title="Supprimer" (click)="remove(it.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card-footer" *ngIf="!loading()">
        <div class="summary">
          <div class="summary-line"><span>Sous-total</span><span class="mono">{{ backendTotal() | number:'1.2-2' }} €</span></div>
          <div class="summary-note">Taxes et livraison calculées à la commande</div>
        </div>
        <div class="actions">
          <button mat-stroked-button color="warn" (click)="clear()" [disabled]="items().length === 0">Vider</button>
          <button mat-raised-button color="primary" (click)="checkout()" [disabled]="items().length === 0">Passer à la caisse</button>
        </div>
      </div>
    </mat-card>
  `,
  styles: [
    `:host {
      display: block;
    }

    .basket-card {
      max-width: 980px;
      margin: 28px auto;
      padding: 0;
      box-sizing: border-box;
      display: block;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(0,0,0,0.06);
    }

    .card-header .title {
      font-size: 1.25rem;
      font-weight: 600;
    }

    .card-header .subtitle {
      color: rgba(0,0,0,0.6);
      font-size: 0.9rem;
    }

    .content {
      padding: 16px 20px;
    }

    .loading { display:flex; justify-content:center; padding:24px 0; }

    .empty {
      text-align: center;
      padding: 36px 0;
      color: rgba(0,0,0,0.6);
    }

    .empty-illustration { font-size: 48px; }
    .empty-text { margin-top: 12px; font-size: 1.05rem; }

    .items { display: flex; flex-direction: column; gap: 18px; }

    /* Ensure rows stay horizontal and have breathing room */
    .item-row {
      display:flex !important;
      flex-direction:row !important;
      align-items:center !important;
      gap:20px !important;
      padding:14px;
      border:1px solid rgba(0,0,0,0.05);
      border-radius:8px;
      background: transparent;
    }

    .thumb {
      width:88px;
      height:88px;
      flex:0 0 88px;
      display:flex;
      align-items:center;
      justify-content:center;
    }

    .thumb img { width:88px; height:88px; object-fit:cover; border-radius:8px; display:block; }

    .thumb-placeholder { width:88px; height:88px; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.04); border-radius:8px; color:rgba(0,0,0,0.6); }

    .details { flex:1 1 auto; min-width:0; overflow:hidden; }
    .name { font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .meta { margin-top:8px; color:rgba(0,0,0,0.6); font-size:0.85rem; }
    .price-small { margin-top:8px; color:rgba(0,0,0,0.75); font-size:0.95rem; }

    .controls {
      display:flex;
      flex-direction:column;
      align-items:flex-end;
      gap:10px;
      width:180px;
      flex:0 0 180px;
    }

    .qty-controls { display:flex; align-items:center; gap:8px; }
    .qty-controls button.mat-mini-button, .qty-controls button.mat-mini-fab { min-width:36px !important; height:28px !important; padding:0 6px !important; border-radius:6px !important; }
    .qty-controls button.mat-mini-button mat-icon, .qty-controls button.mat-mini-fab mat-icon { font-size:20px; }
    .qty-display { min-width:34px; text-align:center; }

    .line-price { font-weight:600; }
    .row-actions { display:flex; gap:8px; align-items:center; }

    .fav-btn mat-icon { color: #d6b200; }
    .delete-btn mat-icon { color: #fff; }
    .delete-btn { background: #d32f2f; border-radius:6px; }
    .delete-btn:hover { background: #b71c1c; }

    button.mat-icon-button { width:36px; height:36px; }

    .card-footer { display:flex; justify-content:space-between; align-items:center; padding:12px 20px; border-top:1px solid rgba(0,0,0,0.06); background:transparent; }
    .summary { min-width:220px; }
    .summary-line { display:flex; justify-content:space-between; font-weight:600; }
    .summary-note { font-size:0.85rem; color:rgba(0,0,0,0.6); margin-top:6px; }
    .actions { display:flex; gap:12px; }
    .mono { font-family: monospace; }

    /* Dark theme explicit overrides to ensure contrast */
    :host-context(body.dark-theme) .card-header .subtitle,
    :host-context(body.dark-theme) .empty,
    :host-context(body.dark-theme) .meta,
    :host-context(body.dark-theme) .price-small,
    :host-context(body.dark-theme) .summary-note { color: rgba(230,238,246,0.85) !important; }

    :host-context(body.dark-theme) .item-row { border-color: rgba(255,255,255,0.03) !important; background: rgba(255,255,255,0.01); }
    :host-context(body.dark-theme) .thumb-placeholder { background: rgba(255,255,255,0.02); color: rgba(230,238,246,0.7); }
    :host-context(body.dark-theme) .fav-btn mat-icon { color: #ffd766 !important; }
    :host-context(body.dark-theme) .delete-btn { background: #c62828 !important; }
    :host-context(body.dark-theme) .basket-card { background: transparent; }

    /* Mobile tweaks */
    @media (max-width:720px) {
      .item-row { flex-direction: row; }
      .controls { width: 140px; }
      .thumb, .thumb img, .thumb-placeholder { width:64px; height:64px; }
      .card-footer { flex-direction:column; align-items:stretch; gap:8px; }
    }
  `]
})
export class BasketComponent implements OnInit {
  // Basket items as returned by the API client DTO
  items = signal<apiClient.apiClient.BasketItemDto[]>([]);
  loading = signal(false);
  // total provided by backend API
  backendTotal = signal<number>(0);

  private parseTotal(v: unknown): number {
    try {
      if (v === null || v === undefined) return 0;
      // If it's an object with a numeric property like { total: 19 } or {value:19}
      if (typeof v === 'object') {
        const obj = v as Record<string, unknown>;
        const candidates = ['total', 'value', 'amount', 'sum'];
        for (const k of candidates) {
          const val = obj[k];
          if (val !== undefined && val !== null) return Number(val as any) || 0;
        }
        // fallback: try first value
        const vals = Object.values(obj);
        if (vals.length) return Number(vals[0] as any) || 0;
        return 0;
      }
      // primitive -> coerce to number
      const n = Number(v as any);
      return isFinite(n) ? n : 0;
    } catch {
      return 0;
    }
  }

  constructor(private cart: BasketService, public auth: AuthStateService, private snack: MatSnackBar, private router: Router, private transloco: TranslocoService) {}

  imageFor(article?: apiClient.apiClient.Article | apiClient.apiClient.ArticleDto): string | undefined {
    if (!article) return undefined;
    const imgs = article.images || article['images'];
    if (!imgs || !Array.isArray(imgs) || imgs.length === 0) return undefined;
    const primary = imgs.find(i => i && (i as any).isPrimary === true);
    if (primary && (primary as any).url) return (primary as any).url as string;
    const first = imgs[0];
    if (first && (first as any).url) return (first as any).url as string;
    return undefined;
  }

  ngOnInit(): void {
    if (this.auth.isLoggedInSignal()()) {
      this.load();
    }
  }

  load() {
    this.loading.set(true);
    this.cart.getBasket().subscribe({
      next: (b: apiClient.apiClient.BasketDto) => {
        // Use the items array as returned by the service directly.
        const arr = Array.isArray(b?.items) ? b.items! : [];
        this.items.set(arr as apiClient.apiClient.BasketItemDto[]);
        // fetch backend total
  this.cart.getTotal().subscribe({ next: t => { this.backendTotal.set(this.parseTotal(t)); this.loading.set(false); }, error: () => { this.backendTotal.set(0); this.loading.set(false); } });
      },
      error: () => {
        this.items.set([]);
        this.backendTotal.set(0);
        this.loading.set(false);
      }
    });
  }

  remove(itemId: number | undefined) {
    if (itemId === undefined || itemId === null) return;
    this.cart.removeItem(itemId).subscribe({ next: () => {
      this.transloco.selectTranslate('app.delete_success').pipe(take(1)).subscribe(msg => { this.snack.open(msg, 'OK', { duration: 2000 }); });
      this.load();
  this.cart.getTotal().subscribe({ next: t => this.backendTotal.set(this.parseTotal(t)), error: () => this.backendTotal.set(0) });
    }, error: () => {
      this.transloco.selectTranslate('app.delete_failed').pipe(take(1)).subscribe(msg => { this.snack.open(msg, 'OK', { duration: 3000 }); });
      this.load();
    } });
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

  increment(item: apiClient.apiClient.BasketItemDto) {
    try {
      // if article has stock info, prevent increasing beyond stock
  const stock = (item.article as any)?.stock as number | undefined;
  const currentQty = (item.quantity ?? 1) as number;
      if (typeof stock === 'number' && currentQty >= stock) {
        // show out of stock message
        this.transloco.selectTranslate('app.out_of_stock').pipe(take(1)).subscribe(msg => { this.snack.open(msg, 'OK', { duration: 2500 }); });
        return;
      }
      const articleId = (item.article?.id ?? item.articleId ?? item.id) as number | undefined;
      if (!articleId) {
        this.transloco.selectTranslate('app.add_failed').pipe(take(1)).subscribe(msg => { this.snack.open(msg, 'OK', { duration: 2500 }); });
        return;
      }
      this.modifyItemQuantity(articleId, 1);
    } catch (err) {
      console.error('increment error', err);
    }
  }

  decrement(item: apiClient.apiClient.BasketItemDto) {
    (async () => {
      try {
        const currentQty = (item.quantity ?? 1) as number;
        const articleId = (item.article?.id ?? item.articleId ?? item.id) as number | undefined;
        const itemId = item.id ?? item.articleId;
        if (!articleId) { this.load(); return; }

        if (currentQty <= 1) {
          // remove the whole line
          this.remove(itemId);
          return;
        }

        // Backend rejects negative deltas; workaround: remove line then re-add with new quantity
        const newQty = currentQty - 1;
        if (itemId === undefined || itemId === null) {
          // fallback: try to call addItem with -1 (may fail) — but we avoid sending negatives
          console.warn('decrement: no itemId, attempting safer add/remove not possible');
          this.load();
          return;
        }

        try {
          // remove existing line
          await firstValueFrom(this.cart.removeItem(itemId));
        } catch (e) {
          console.warn('decrement: removeItem failed, proceeding to try add with reduced qty', e);
        }

        try {
          // re-add with desired quantity
          await firstValueFrom(this.cart.addItem(articleId, newQty));
        } catch (e) {
          console.error('decrement: failed to add item with new quantity', e);
          this.transloco.selectTranslate('app.add_failed').pipe(take(1)).subscribe(msg => { this.snack.open(msg, 'OK', { duration: 3000 }); });
        }

        this.load();
      } catch (err) {
        console.error('decrement error', err);
      }
    })();
  }

  private modifyItemQuantity(articleId: number, delta: number) {
    this.cart.addItem(articleId, delta).subscribe({ next: () => {
      this.load();
      this.cart.getTotal().subscribe({ next: t => this.backendTotal.set(this.parseTotal(t)), error: () => this.backendTotal.set(0) });
    }, error: (e) => {
      console.error('modifyItemQuantity failed', e);
      // show a generic add/remove failed message
      this.transloco.selectTranslate(delta > 0 ? 'app.add_failed' : 'app.delete_failed').pipe(take(1)).subscribe(msg => { this.snack.open(msg, 'OK', { duration: 2500 }); });
      this.load();
    } });
  }

  async clear() {
    try {
      const items = this.items();
      for (const it of items) {
        // best-effort remove sequentially
        const id = it.id;
        if (id !== undefined && id !== null) {
          await new Promise<void>((res) => this.cart.removeItem(id).subscribe({ next: () => res(), error: () => res() }));
        }
      }
  this.transloco.selectTranslate('app.basket_cleared').pipe(take(1)).subscribe(msg => { this.snack.open(msg, 'OK', { duration: 2000 }); });
  this.load();
   this.cart.getTotal().subscribe({ next: t => this.backendTotal.set(this.parseTotal(t)), error: () => this.backendTotal.set(0) });
    } catch (err) {
      console.error('clear failed', err);
  this.transloco.selectTranslate('app.basket_clear_failed').pipe(take(1)).subscribe(msg => { this.snack.open(msg, 'OK', { duration: 3000 }); });
    }
  }

  // Helpers to avoid undefined errors in templates
  unitPriceOf(item: apiClient.apiClient.BasketItemDto): number {
    return Number(item.article?.price ?? 0) || 0;
  }

  quantityOf(item: apiClient.apiClient.BasketItemDto): number {
    return Number(item.quantity ?? 1) || 1;
  }

  linePriceOf(item: apiClient.apiClient.BasketItemDto): number {
    return this.unitPriceOf(item) * this.quantityOf(item);
  }
}
