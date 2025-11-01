import { Component, Input, Signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BasketService } from '../../services/basket.service';
import * as apiClient from '../../api-client';

@Component({
  selector: 'app-article-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  template: `
  <table mat-table [dataSource]="articlesList" matSort class="mat-elevation-z1" style="width:100%;min-width:600px;">
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
        <td mat-cell *matCellDef="let article">{{ article.id }}</td>
      </ng-container>
      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Titre</th>
        <td mat-cell *matCellDef="let article">{{ article.title }}</td>
      </ng-container>
      <ng-container matColumnDef="content">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Contenu</th>
        <td mat-cell *matCellDef="let article">{{ article.content }}</td>
      </ng-container>
      <ng-container matColumnDef="category">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Catégorie</th>
        <td mat-cell *matCellDef="let article">{{ article.category?.name || '—' }}</td>
      </ng-container>
      <ng-container matColumnDef="price">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Prix (€)</th>
        <td mat-cell *matCellDef="let article">{{ article.price | number:'1.2-2' }} €</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let article">
          <div class="actions-cell">
            <button mat-stroked-button color="primary" (click)="addToCart(article, $event)">
              <mat-icon>shopping_cart</mat-icon>
              &nbsp;Ajouter
            </button>
            <button mat-icon-button color="warn" aria-label="Supprimer" (click)="delete(article, $event)">
              <mat-icon class="delete-icon">delete</mat-icon>
            </button>
          </div>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;" style="cursor:pointer;" (click)="goTo(row)"></tr>
    </table>
  `
    ,
    styles: [`
      /* color delete icon red */
      .delete-icon { color: var(--mat-warn-foreground, #f44336); }
      .actions-cell { display:flex; align-items:center; gap:8px; }
      .actions-cell button[mat-stroked-button] { height:36px; }
    `]
})
export class ArticleTableComponent {
  @Input() articles: apiClient.apiClient.Article[] | Signal<apiClient.apiClient.Article[]> = [];
  @Output() deleteArticle = new EventEmitter<number>();
  displayedColumns: string[] = ['id', 'title', 'content', 'category', 'price', 'actions'];

  constructor(private cart: BasketService, private router: Router, public transloco: TranslocoService, private snackBar: MatSnackBar) {}

  addToCart(article: apiClient.apiClient.Article, event?: Event) {
    if (event) event.stopPropagation();
    if (!article?.id) return;
    this.cart.addItem(article.id, 1).subscribe({
      next: () => {
        const msg = this.transloco.translate('app.added_to_cart', { title: article.title });
        this.snackBar.open(msg, undefined, { duration: 2500 });
      },
      error: () => {
        const msg = this.transloco.translate('app.add_failed');
        this.snackBar.open(msg, undefined, { duration: 3000 });
      }
    });
  }

  delete(article: apiClient.apiClient.Article, event?: Event) {
    if (event) event.stopPropagation();
    if (!article?.id) return;
    this.deleteArticle.emit(article.id);
  }

  goTo(article: apiClient.apiClient.Article) {
    if (!article?.id) return;
    this.router.navigate(['/', this.transloco.getActiveLang() || 'fr', 'articles', article.id]);
  }

  get articlesList(): apiClient.apiClient.Article[] {
    if (typeof this.articles === 'function') {
      return this.articles();
    }
    return this.articles;
  }
}
