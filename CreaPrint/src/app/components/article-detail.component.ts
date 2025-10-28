import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { apiClient } from '../api-client';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card *ngIf="article">
      <mat-card-header>
        <mat-card-title>{{ article.title }}</mat-card-title>
        <mat-card-subtitle>{{ article.category }}</mat-card-subtitle>
      </mat-card-header>
      <div style="width:100%;display:flex;justify-content:center;align-items:center;">
        <img mat-card-image src="https://placehold.co/400x200?text=Image+Article" alt="Image de l'article" style="max-width:400px;max-height:200px;object-fit:cover;border-radius:8px;" />
      </div>
      <mat-card-content>
        <p>{{ article.content }}</p>
      </mat-card-content>
    </mat-card>
    <div *ngIf="!article">Aucun article sélectionné.</div>
  `
})
export class ArticleDetailComponent {
  @Input() article?: apiClient.Article;
}
