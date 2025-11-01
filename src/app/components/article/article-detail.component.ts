import { Component, Input, Output, EventEmitter, OnInit, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
// using simple styled chips instead of MatChips to avoid standalone import issues
import { MatDividerModule } from '@angular/material/divider';
import * as apiClient from '../../api-client';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';
import { BasketService } from '../../services/basket.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, /* new */ MatButtonModule, MatProgressSpinnerModule, MatIconModule, MatDividerModule, MatSnackBarModule, TranslocoModule],
  template: `
    <div class="detail-root">
      <div class="spinner" *ngIf="loading()">
        <mat-progress-spinner mode="indeterminate" diameter="48"></mat-progress-spinner>
      </div>

      <mat-card *ngIf="!loading() && article()" class="detail-card">
        <div class="media">
          <img class="media-img" src="https://placehold.co/640x360?text=Article+Image" alt="Image de l'article" />
        </div>
        <div class="content">
          <div class="header">
            <h2 class="title">{{ article()?.title }}</h2>
            <div class="meta">
                <ng-container *ngIf="article() as a">
                  <span class="chip" *ngIf="a.category?.name">{{ a.category?.name }}</span>
                  <span class="chip accent">Prix: {{ a.price | number:'1.2-2' }} €</span>
                  <span class="chip" *ngIf="a.stock !== undefined">
                    <ng-container *ngIf="a.stock > 0">{{ 'app.in_stock' | transloco:{count: a.stock} }}</ng-container>
                    <ng-container *ngIf="a.stock <= 0">{{ 'app.out_of_stock' | transloco }}</ng-container>
                  </span>
                </ng-container>
            </div>
          </div>

          <mat-divider></mat-divider>

          <div class="body">
            <p>{{ article()?.content }}</p>
          </div>

          <div class="actions">
            <span class="spacer"></span>
            <button mat-stroked-button color="primary" (click)="addToCart()">
              <mat-icon>shopping_cart</mat-icon>
              &nbsp;Ajouter
            </button>
            <button mat-flat-button color="accent" (click)="edit()">
              <mat-icon>edit</mat-icon>
              Éditer
            </button>
            &nbsp;
            <button mat-icon-button color="warn" aria-label="Supprimer" (click)="deleteCurrent()">
              <mat-icon class="delete-icon">delete</mat-icon>
            </button>
          </div>
        </div>
      </mat-card>

      <div class="empty" *ngIf="!loading() && !article()">Aucun article sélectionné.</div>
    </div>
  `,
  styles: [
    `
    .detail-root { width:100%; display:flex; justify-content:center; }
    .spinner { margin: 2rem; display:flex; align-items:center; justify-content:center; }
    .detail-card { display:flex; gap:1.5rem; padding:1rem; max-width:1000px; width:100%; }
    .media { flex: 0 0 360px; display:flex; align-items:center; justify-content:center; }
    .media-img { width:100%; height:auto; border-radius:8px; object-fit:cover; }
    .content { flex:1; display:flex; flex-direction:column; }
    .header { display:flex; align-items:center; justify-content:space-between; gap:1rem; }
  .title { margin:0 0 0.75rem 0; font-size:1.6rem; }
    .meta { display:flex; align-items:center; gap:0.5rem; }
  mat-divider { margin: 0.5rem 0 1rem 0; }
  .body { margin-top:0; flex:1; }
    .actions { display:flex; align-items:center; gap:0.5rem; margin-top:1rem; }
    .spacer { flex:1; }
    .empty { margin:2rem; color:rgba(0,0,0,0.6); }
  .chip { display:inline-block; padding:4px 10px; border-radius:16px; background:#e0e0e0; color:#222; font-size:0.9rem; }
  .chip.accent { background:#ffd54f; }
  .delete-icon { color: var(--mat-warn-foreground, #f44336); }
    @media (max-width:800px) {
      .detail-card { flex-direction:column; }
      .media { flex: 0 0 auto; width:100%; }
    }
    `
  ]
})
export class ArticleDetailComponent {
  private articleSignal = signal<apiClient.apiClient.Article | undefined>(undefined);
  article: Signal<apiClient.apiClient.Article | undefined> = this.articleSignal;
  loading = signal(false);
  private loadedFromRoute = false;

  @Input('article')
  set articleInput(a: apiClient.apiClient.Article | undefined) {
    this.articleSignal.set(a);
    // if an article was provided via @Input, this component is embedded and not loaded from the route
    this.loadedFromRoute = false;
  }

  constructor(private route: ActivatedRoute, private articleService: ArticleService, private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog, private cart: BasketService, public transloco: TranslocoService) {}

  ngOnInit(): void {
    // Subscribe to route changes and fetch when an id is present if no input was provided
    this.route.paramMap.subscribe(pm => {
      const idStr = pm.get('id');
      const id = idStr ? Number(idStr) : NaN;
      // If the component already has an article (from @Input), skip fetching for the same id
      const current = this.articleSignal();
      if (!isNaN(id) && (!current || current.id !== id)) {
        this.loading.set(true);
        this.loadedFromRoute = true;
        this.articleService.getArticle(id).subscribe({
          next: a => { this.articleSignal.set(a); this.loading.set(false); },
          error: () => { this.articleSignal.set(undefined); this.loading.set(false); }
        });
      }
    });
  }
  @Output() back = new EventEmitter<void>();
  @Output() deleteArticle = new EventEmitter<number>();

  edit() {
    const a = this.articleSignal();
    if (!a || !a.id) return;
    const lang = this.route.snapshot.paramMap.get('lang') || 'fr';
    this.router.navigate(['/', lang, 'articles', a.id, 'edit']);
  }

  deleteCurrent() {
    const a = this.articleSignal();
    if (!a || !a.id) return;
    // If this component was loaded via the route (standalone), perform the delete here
    if (this.loadedFromRoute) {
      const ref = this.dialog.open(ConfirmDialogComponent, { data: { id: a.id } });
      ref.afterClosed().subscribe((confirmed: boolean) => {
        if (!confirmed) return;
          this.articleService.deleteArticle(a.id!).subscribe({
          next: () => {
            this.snackBar.open('Article supprimé', undefined, { duration: 3000 });
            const lang = this.route.snapshot.paramMap.get('lang') || 'fr';
            this.router.navigate(['/', lang, 'articles']);
          },
          error: () => {
            this.snackBar.open('Impossible de supprimer l\'article', undefined, { duration: 3000 });
          }
        });
      });
      return;
    }

    // Otherwise, notify parent to handle deletion
    this.deleteArticle.emit(a.id);
  }

  addToCart() {
    const a = this.articleSignal();
    if (!a || !a.id) return;
    this.cart.addItem(a.id, 1).subscribe({
      next: () => {
        const msg = this.snackBarMessage(a.title || '');
        this.snackBar.open(msg, undefined, { duration: 2500 });
      },
      error: () => {
        this.transloco.selectTranslate('app.add_failed').subscribe(msg => {
          this.snackBar.open(msg, undefined, { duration: 3000 });
        });
      }
    });
  }

  private snackBarMessage(title: string) {
    // Use Transloco if available
    try {
      return this.transloco.translate('app.added_to_cart', { title });
    } catch (e) {
      return `Article ajouté au panier${title ? ': ' + title : ''}`;
    }
  }
}
