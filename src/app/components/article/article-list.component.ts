import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { ArticleDetailComponent } from './article-detail.component';
import { ArticleGridComponent } from './article-grid.component';
import { ArticleTableComponent } from './article-table.component';
import { ArticleListToolbarComponent } from './article-list-toolbar.component';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';
import { RouterLink } from '@angular/router';

import { signal } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { Router } from '@angular/router';
import * as apiClient from '../../api-client';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatListModule, MatTableModule, ArticleDetailComponent, ArticleGridComponent, ArticleTableComponent, ArticleListToolbarComponent, MatSlideToggleModule, MatIconModule, MatButtonModule, MatPaginatorModule, MatProgressSpinnerModule, MatSnackBarModule, MatDialogModule, RouterLink],
  template: `
  <mat-card style="width:100%;max-width:none;margin-bottom:3rem;padding:2rem;">
    <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem;">
      <mat-card-title style="font-size:1.5rem;font-weight:600;letter-spacing:0.4px;">Liste des articles</mat-card-title>
      <span style="flex:1 1 auto"></span>
      <button mat-flat-button color="primary" routerLink="/articles/new"><mat-icon>add</mat-icon>&nbsp;Créer un article</button>
    </div>
    <mat-card-content>
      <app-article-list-toolbar (search)="onSearch($event)" [isGridMode]="isGridMode"></app-article-list-toolbar>

      <div *ngIf="!loading() && pagedArticles().length && !selectedArticle()">
        <ng-container *ngIf="!isGridMode(); else gridView">
            <div style="width:100%;overflow-x:auto;">
            <app-article-table [articles]="pagedArticles()" (deleteArticle)="confirmAndDelete($event)"></app-article-table>
          </div>
        </ng-container>
        <ng-template #gridView>
          <app-article-grid [articles]="pagedArticles()" (deleteArticle)="confirmAndDelete($event)"></app-article-grid>
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

  <app-article-detail *ngIf="selectedArticle()" [article]="selectedArticle()" (back)="selectedArticle.set(undefined)" (deleteArticle)="onDelete($event)"></app-article-detail>
    </mat-card-content>
  </mat-card>
  `
})
export class ArticleListComponent implements OnInit {
  articles = signal<apiClient.apiClient.Article[]>([]);
  loading = signal(true);
  selectedArticle = signal<apiClient.apiClient.Article | undefined>(undefined);
  isGridMode = signal(true);

  pageSize = signal(10);
  pageIndex = signal(0);
  pagedArticles = signal<apiClient.apiClient.Article[]>([]);
  total = signal(0);

  constructor(private articleService: ArticleService, private cdr: ChangeDetectorRef, private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog) {}

  confirmAndDelete(id: number) {
    if (!id) return;
    const ref = this.dialog.open(ConfirmDialogComponent, { data: { id } });
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.onDelete(id);
      }
    });
  }

  onDelete(id: number) {
    if (!id) return;
    this.articleService.deleteArticle(id).subscribe({
      next: () => {
        this.snackBar.open('Article supprimé', undefined, { duration: 3000 });
        // if currently viewing this article in detail, clear it and navigate to list
        const sel = this.selectedArticle();
        if (sel && sel.id === id) {
          this.selectedArticle.set(undefined);
          this.router.navigate(['/articles']);
        }
        // refresh current page
        this.fetchPage();
      },
      error: () => {
        this.snackBar.open('Impossible de supprimer l\'article', undefined, { duration: 3000 });
      }
    });
  }

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

    // Use server-side search by title (new API)
    this.loading.set(true);
    this.articleService.search(q).subscribe({
      next: results => {
        const arr = Array.isArray(results) ? results : [];
        this.pagedArticles.set(arr);
        this.articles.set(arr);
        this.total.set(arr.length);
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
