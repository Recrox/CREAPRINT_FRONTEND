import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { apiClient } from '../api-client';

@Component({
  selector: 'app-article-grid',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="article-grid">
      <mat-card *ngFor="let article of articles" class="article-card">
        <img mat-card-image src="https://placehold.co/400x200?text=Image+Article" alt="Image de l'article" />
        <mat-card-header>
          <mat-card-title>{{ article.title }}</mat-card-title>
          <mat-card-subtitle>{{ article.category }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>{{ article.content }}</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .article-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
      width: 100%;
      margin-top: 1rem;
    }
    .article-card {
      width: 100%;
      max-width: 400px;
      margin: auto;
    }
  `]
})
export class ArticleGridComponent {
  @Input() articles: apiClient.Article[] = [];
}
