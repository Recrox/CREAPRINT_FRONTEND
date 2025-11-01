import { Component, Input, Signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';
import { take } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import * as apiClient from '../../api-client';
import { BasketService } from '../../services/basket.service';

@Component({
  selector: 'app-article-grid',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule, TranslocoModule],
  template: `
    <div class="article-grid">
      <mat-card *ngFor="let article of articlesList" class="article-card" style="cursor:pointer;" (click)="goTo(article)">
  <img mat-card-image [src]="imageFor(article) || 'https://placehold.co/400x200?text=Image+Article'" [alt]="article.title || 'Article image'" />
        <mat-card-header>
          <mat-card-title>#{{ article.id }} - {{ article.title }}</mat-card-title>
          <mat-card-subtitle>{{ article.category?.name || 'Sans catégorie' }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>{{ article.content }}</p>
          <div style="margin-top:0.5rem;font-weight:bold;">Prix : {{ article.price | number:'1.2-2' }} €</div>
            <div style="margin-top:0.25rem;font-size:0.9rem;color:rgba(0,0,0,0.7);">
              <ng-container *ngIf="article.stock !== undefined">
                <span *ngIf="article.stock > 0">{{ 'app.in_stock' | transloco:{count: article.stock} }}</span>
                <span *ngIf="article.stock <= 0">{{ 'app.out_of_stock' | transloco }}</span>
              </ng-container>
            </div>
          <div style="margin-top:0.75rem;display:flex;justify-content:space-between;align-items:center;">
            <div>
              <button mat-stroked-button color="primary" (click)="addToCart(article, $event)" [disabled]="article.stock !== undefined && article.stock <= 0">
                <mat-icon>shopping_cart</mat-icon>
                &nbsp;Ajouter
              </button>
            </div>
            <div>
              <button mat-icon-button color="warn" aria-label="Supprimer" (click)="delete(article, $event)">
                <mat-icon class="delete-icon">delete</mat-icon>
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .article-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 0.5rem; /* reduced spacing between cards */
      width: 100%;
      margin-top: 0.5rem;
    }
    .article-card {
      width: 100%;
      max-width: 290px; /* slightly narrower so rows fit tighter */
      margin: auto;
    }
    /* make delete icons clearly red */
    .delete-icon { color: var(--mat-warn-foreground, #f44336); }
  `]
})
export class ArticleGridComponent {
  @Input() articles: apiClient.apiClient.Article[] | Signal<apiClient.apiClient.Article[]> = [];
  @Output() deleteArticle = new EventEmitter<number>();

  constructor(private cart: BasketService, private router: Router, public transloco: TranslocoService, private snackBar: MatSnackBar) {}

  addToCart(article: apiClient.apiClient.Article, event?: Event) {
    if (event) event.stopPropagation();
    if (!article?.id) return;
    this.cart.addItem(article.id, 1).subscribe({
      next: () => {
        const msg = this.transloco.translate('app.added_to_cart', { title: article.title });
        this.snackBar.open(msg, undefined, { duration: 2500 });
      },
      error: (err: any) => {
        console.error('Add to cart failed', err);
        // if unauthorized, prompt to login (keep message readable)
        const status = err?.status || err?.response?.status || (err?.statusCode || null);
        if (status === 401) {
          this.transloco.selectTranslate('app.login', undefined).pipe(take(1)).subscribe(loginLabel => {
            const msg = `${loginLabel} required to add to cart`;
            this.snackBar.open(msg, loginLabel, { duration: 4000 });
          });
          return;
        }
        // use selectTranslate so we wait for translations to be available
        this.transloco.selectTranslate('app.add_failed').pipe(take(1)).subscribe(msg => {
          this.snackBar.open(msg, undefined, { duration: 3000 });
        });
      }
    });
  }

  delete(article: apiClient.apiClient.Article, event?: Event) {
    if (event) event.stopPropagation();
    if (!article?.id) return;
    this.deleteArticle.emit(article.id);
  }

  goTo(article: apiClient.apiClient.Article) {
    if (!article?.id) return;
    this.router.navigate(['/', this.transloco.getActiveLang() || 'fr', 'articles', article.id]);
  }

  imageFor(article: apiClient.apiClient.Article): string | undefined {
    if (!article) return undefined;
    // Article.images is an array of ArticleImage with a 'url' property generated by the API client
    const imgs = (article as any).images as Array<any> | undefined;
    if (!imgs || imgs.length === 0) return undefined;
    const primary = imgs.find(i => i && i.isPrimary);
    if (primary && primary.url) return primary.url;
    if (imgs[0] && imgs[0].url) return imgs[0].url;
    return undefined;
  }

  get articlesList(): apiClient.apiClient.Article[] {
    if (typeof this.articles === 'function') {
      return this.articles();
    }
    return this.articles;
  }
}
