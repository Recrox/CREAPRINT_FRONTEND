import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { ArticleService } from '../services/article.service';
import { apiClient } from '../api-client';
import { ArticleDetailComponent } from './article-detail.component';
import { ArticleGridComponent } from './article-grid.component';
import { ArticleTableComponent } from './article-table.component';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatListModule, MatTableModule, ArticleDetailComponent, ArticleGridComponent, ArticleTableComponent, MatSlideToggleModule, MatIconModule],
  template: `
  <mat-card style="width:100%;max-width:none;margin-bottom:3rem;padding:2rem;">
  <mat-card-title style="text-align:center;">Liste des articles</mat-card-title>
      <mat-card-content>
        <div style="margin-bottom:1rem; display: flex; align-items: center; gap: 1rem;">
          <mat-slide-toggle color="primary" [(ngModel)]="isGridMode" style="margin-right: 1rem;">
            <mat-icon>{{ isGridMode ? 'grid_view' : 'table_chart' }}</mat-icon>
            <span style="margin-left:0.5rem;">{{ isGridMode ? 'Mosaïque' : 'Tableau' }}</span>
          </mat-slide-toggle>
        </div>
  <div *ngIf="!isGridMode && !loading && articles.length && !selectedArticle">
    <div style="width:100%;overflow-x:auto;">
      <app-article-table
        [articles]="articles"
        [selectArticle]="selectArticle.bind(this)">
      </app-article-table>
    </div>
  </div>
  <div *ngIf="isGridMode && !loading && articles.length && !selectedArticle">
          <app-article-grid [articles]="articles"></app-article-grid>
        </div>
        <div *ngIf="loading">Chargement...</div>
        <div *ngIf="!loading && articles.length === 0">Aucun article trouvé.</div>

  <app-article-detail *ngIf="selectedArticle" [article]="selectedArticle" (back)="selectedArticle = undefined"></app-article-detail>
      </mat-card-content>
    </mat-card>
  `
})
export class ArticleListComponent implements OnInit {
  articles: apiClient.Article[] = [];
  loading = true;
  // displayedColumns déplacé dans ArticleTableComponent
  selectedArticle?: apiClient.Article;
  isGridMode = false;

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.articleService.getAllArticles().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.articles = data;
        } else {
          this.articles = [];
        }
        this.loading = false;
      },
      error: () => {
        this.articles = [];
        this.loading = false;
      }
    });
  }

  selectArticle(article: apiClient.Article) {
    this.selectedArticle = article;
  }
}
