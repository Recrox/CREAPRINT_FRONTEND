import { Component, Input, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import * as apiClient from '../../api-client';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-article-grid',
  standalone: true,
  imports: [CommonModule, MatCardModule, RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="article-grid">
      <mat-card *ngFor="let article of articlesList" class="article-card">
        <img mat-card-image src="https://placehold.co/400x200?text=Image+Article" alt="Image de l'article" />
        <mat-card-header>
          <mat-card-title><a [routerLink]="['/articles', article.id]">#{{ article.id }} - {{ article.title }}</a></mat-card-title>
          <mat-card-subtitle>{{ article.category?.name || 'Sans catégorie' }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>{{ article.content }}</p>
          <div style="margin-top:0.5rem;font-weight:bold;">Prix : {{ article.price | number:'1.2-2' }} €</div>
          <div style="margin-top:0.75rem;display:flex;justify-content:flex-end;">
            <button mat-stroked-button color="primary" (click)="addToCart(article)">
              <mat-icon>shopping_cart</mat-icon>
              &nbsp;Ajouter
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .article-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1rem;
      width: 100%;
      margin-top: 1rem;
    }
    .article-card {
      width: 100%;
      max-width: 300px;
      margin: auto;
    }
  `]
})
export class ArticleGridComponent {
  @Input() articles: apiClient.apiClient.Article[] | Signal<apiClient.apiClient.Article[]> = [];

  constructor(private cart: CartService) {}

  addToCart(article: apiClient.apiClient.Article) {
    if (!article?.id) return;
    this.cart.addItem(article.id, 1).subscribe({ next: () => {}, error: () => {} });
  }

  get articlesList(): apiClient.apiClient.Article[] {
    if (typeof this.articles === 'function') {
      return this.articles();
    }
    return this.articles;
  }
}
