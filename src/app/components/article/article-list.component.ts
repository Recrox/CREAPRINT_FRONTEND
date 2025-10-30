import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { ArticleDetailComponent } from './article-detail.component';
import { ArticleGridComponent } from './article-grid.component';
import { ArticleTableComponent } from './article-table.component';
import { ArticleSearchComponent } from './article-search.component';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';

import { signal } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { Router } from '@angular/router';
import * as apiClient from '../../api-client';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatListModule, MatTableModule, ArticleDetailComponent, ArticleGridComponent, ArticleTableComponent, ArticleSearchComponent, MatSlideToggleModule, MatIconModule, MatPaginatorModule, MatProgressSpinnerModule],
  template: `
  <mat-card style="width:100%;max-width:none;margin-bottom:3rem;padding:2rem;">
    <mat-card-title style="text-align:center;">Liste des articles</mat-card-title>
    <mat-card-content>
      <div style="margin-bottom:1rem; display: flex; align-items: center; gap: 1rem;">
        <div style="flex:1;">
          <app-article-search (search)="onSearch($event)"></app-article-search>
        </div>
        <mat-slide-toggle color="primary" [checked]="isGridMode()" (change)="isGridMode.set($event.checked)" style="margin-left:0.5rem;">
          <mat-icon>{{ isGridMode() ? 'grid_view' : 'table_chart' }}</mat-icon>
          <span style="margin-left:0.5rem;">{{ isGridMode() ? 'Grille' : 'Tableau' }}</span>
        </mat-slide-toggle>
      </div>

      <div *ngIf="!loading() && pagedArticles().length && !selectedArticle()">
        <ng-container *ngIf="!isGridMode(); else gridView">
          <div style="width:100%;overflow-x:auto;">
            <app-article-table [articles]="pagedArticles()"></app-article-table>
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
      <div *ngIf="loading()" style="display:flex;justify-content:center;align-items:center;padding:2rem;">
        <mat-progress-spinner
          mode="indeterminate"
          color="primary"
          diameter="48"
          aria-label="Chargement des articles">
        </mat-progress-spinner>
      </div>
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

  constructor(private articleService: ArticleService, private cdr: ChangeDetectorRef, private router: Router) {}

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

  // Search handler: if query present, filter client-side by title/content; otherwise use server paging
  onSearch(query: string) {
    const q = (query || '').trim().toLowerCase();
    if (!q) {
      // reset to server page
      this.fetchPage();
      return;
    }

    // For simplicity, fetch all items once then filter locally
    this.loading.set(true);
    this.articleService.getAllArticles().subscribe({
      next: all => {
        const arr = Array.isArray(all) ? all : [];
        const filtered = arr.filter(a => {
          const title = (a.title || '').toString().toLowerCase();
          const content = (a.content || '').toString().toLowerCase();
          return title.includes(q) || content.includes(q);
        });
        this.pagedArticles.set(filtered as any);
        this.articles.set(filtered as any);
        this.total.set(filtered.length);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.pagedArticles.set([]);
        this.loading.set(false);
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
    // Navigate to detail route
    this.router.navigate(['/articles', article.id]);
  }
}
