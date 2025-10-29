import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { ArticleDetailComponent } from './article-detail.component';
import { ArticleGridComponent } from './article-grid.component';
import { ArticleTableComponent } from './article-table.component';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';

import { signal } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import * as apiClient from '../../api-client';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatListModule, MatTableModule, ArticleDetailComponent, ArticleGridComponent, ArticleTableComponent, MatSlideToggleModule, MatIconModule, MatPaginatorModule],
  template: `
  <mat-card style="width:100%;max-width:none;margin-bottom:3rem;padding:2rem;">
    <mat-card-title style="text-align:center;">Liste des articles</mat-card-title>
    <mat-card-content>
      <div style="margin-bottom:1rem; display: flex; align-items: center; gap: 1rem;">
        <mat-slide-toggle color="primary" [checked]="isGridMode()" (change)="isGridMode.set($event.checked)" style="margin-right: 1rem;">
          <mat-icon>{{ isGridMode() ? 'grid_view' : 'table_chart' }}</mat-icon>
          <span style="margin-left:0.5rem;">{{ isGridMode() ? 'Mosaïque' : 'Tableau' }}</span>
        </mat-slide-toggle>
      </div>

      <div *ngIf="!loading() && pagedArticles().length && !selectedArticle()">
        <ng-container *ngIf="!isGridMode(); else gridView">
          <div style="width:100%;overflow-x:auto;">
            <app-article-table
              [articles]="pagedArticles()"
              [selectArticle]="selectArticle.bind(this)">
            </app-article-table>
          </div>
        </ng-container>
        <ng-template #gridView>
          <app-article-grid [articles]="pagedArticles()"></app-article-grid>
        </ng-template>
        <mat-paginator
          [length]="total()"
          [pageSize]="pageSize()"
          [pageIndex]="pageIndex()"
          [pageSizeOptions]="[5, 10, 20]"
          (page)="onPageChange($event)"
          style="margin-top:1rem;">
        </mat-paginator>
      </div>
      <div *ngIf="loading()">Chargement...</div>
      <div *ngIf="!loading() && articles().length === 0">Aucun article trouvé.</div>

      <app-article-detail *ngIf="selectedArticle()" [article]="selectedArticle()" (back)="selectedArticle.set(undefined)"></app-article-detail>
    </mat-card-content>
  </mat-card>
  `
})
export class ArticleListComponent implements OnInit {
  articles = signal<apiClient.apiClient.Article[]>([]);
  loading = signal(true);
  selectedArticle = signal<apiClient.apiClient.Article | undefined>(undefined);
  isGridMode = signal(false);

  pageSize = signal(10);
  pageIndex = signal(0);
  pagedArticles = signal<apiClient.apiClient.Article[]>([]);
  total = signal(0);

  constructor(private articleService: ArticleService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchPage();
  }

  private fetchPage() {
    this.loading.set(true);
    const page = this.pageIndex();
    const size = this.pageSize();
    this.articleService.getPagedArticles(page, size).subscribe({
      next: data => {
        const arr = Array.isArray(data) ? data : [];
        this.pagedArticles.set(arr);
        // Optionally keep a cumulative list
        this.articles.set(arr);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.pagedArticles.set([]);
        this.articles.set([]);
        this.loading.set(false);
        this.cdr.markForCheck();
      }
    });

    // Fetch total count
    this.articleService.count().subscribe({
      next: total => {
        this.total.set(typeof total === 'number' ? total : 0);
        this.cdr.markForCheck();
      },
      error: () => {
        this.total.set(0);
        this.cdr.markForCheck();
      }
    });
  }

  onPageChange(event: any) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.fetchPage();
  }

  selectArticle(article: apiClient.apiClient.Article) {
    this.selectedArticle.set(article);
  }
}
