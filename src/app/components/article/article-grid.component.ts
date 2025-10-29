import { Component, Input, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import * as apiClient from '../../api-client';

@Component({
  selector: 'app-article-grid',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="article-grid">
      <mat-card *ngFor="let article of articlesList" class="article-card">
        <img mat-card-image src="https://placehold.co/400x200?text=Image+Article" alt="Image de l'article" />
        <mat-card-header>
          <mat-card-title>#{{ article.id }} - {{ article.title }}</mat-card-title>
          <mat-card-subtitle>{{ article.category?.name || 'Sans catégorie' }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>{{ article.content }}</p>
          <div style="margin-top:0.5rem;font-weight:bold;">Prix : {{ article.price | number:'1.2-2' }} €</div>
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

  get articlesList(): apiClient.apiClient.Article[] {
    if (typeof this.articles === 'function') {
      return this.articles();
    }
    return this.articles;
  }
}
