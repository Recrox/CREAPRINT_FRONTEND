import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { ArticleService } from '../services/article.service';
import { apiClient } from '../api-client';
import { ArticleDetailComponent } from './article-detail.component';
import { ArticleGridComponent } from './article-grid.component';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatListModule, MatTableModule, ArticleDetailComponent, ArticleGridComponent, MatSlideToggleModule, MatIconModule],
  template: `
  <mat-card style="width:100%;max-width:none;margin-bottom:3rem;">
      <mat-card-title>Liste des articles</mat-card-title>
      <mat-card-content>
        <div style="margin-bottom:1rem; display: flex; align-items: center; gap: 1rem;">
          <mat-slide-toggle color="primary" [(ngModel)]="isGridMode" style="margin-right: 1rem;">
            <mat-icon>{{ isGridMode ? 'grid_view' : 'table_chart' }}</mat-icon>
            <span style="margin-left:0.5rem;">{{ isGridMode ? 'Mosaïque' : 'Tableau' }}</span>
          </mat-slide-toggle>
        </div>
  <div *ngIf="!isGridMode">
          <div style="width:100%;overflow-x:auto;">
            <table mat-table [dataSource]="articles" class="mat-elevation-z1" style="width:100%;min-width:600px;" *ngIf="!loading && articles.length && !selectedArticle">
              <ng-container matColumnDef="title">
                <th mat-header-cell *matHeaderCellDef>Titre</th>
                <td mat-cell *matCellDef="let article">
                  <a href="#" (click)="selectArticle(article); $event.preventDefault();">{{ article.title }}</a>
                </td>
              </ng-container>
              <ng-container matColumnDef="content">
                <th mat-header-cell *matHeaderCellDef>Contenu</th>
                <td mat-cell *matCellDef="let article">{{ article.content }}</td>
              </ng-container>
              <ng-container matColumnDef="category">
                <th mat-header-cell *matHeaderCellDef>Catégorie</th>
                <td mat-cell *matCellDef="let article">{{ article.category }}</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
        </div>
  <div *ngIf="isGridMode && !loading && articles.length && !selectedArticle">
          <app-article-grid [articles]="articles"></app-article-grid>
        </div>
        <div *ngIf="loading">Chargement...</div>
        <div *ngIf="!loading && articles.length === 0">Aucun article trouvé.</div>
  <app-article-detail *ngIf="selectedArticle" [article]="selectedArticle"></app-article-detail>
  <button mat-button *ngIf="selectedArticle" (click)="selectedArticle = undefined">Retour à la liste</button>
      </mat-card-content>
    </mat-card>
  `
})
export class ArticleListComponent implements OnInit {
  articles: apiClient.Article[] = [];
  loading = true;
  displayedColumns: string[] = ['title', 'content', 'category'];
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
