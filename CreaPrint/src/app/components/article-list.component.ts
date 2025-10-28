import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { ArticleService } from '../services/article.service';
import { apiClient } from '../api-client';
import { ArticleDetailComponent } from './article-detail.component';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatTableModule, ArticleDetailComponent],
  template: `
    <mat-card>
      <mat-card-title>Liste des articles</mat-card-title>
      <mat-card-content>
        <table mat-table [dataSource]="articles" class="mat-elevation-z1" *ngIf="!loading && articles.length && !selectedArticle">
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
