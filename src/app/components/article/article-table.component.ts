import { Component, Input, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../../services/cart.service';
import * as apiClient from '../../api-client';

@Component({
  selector: 'app-article-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatButtonModule],
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
          <button mat-stroked-button color="primary" (click)="addToCart(article, $event)">Ajouter au panier</button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;" style="cursor:pointer;" (click)="goTo(row)"></tr>
    </table>
  `
})
export class ArticleTableComponent {
  @Input() articles: apiClient.apiClient.Article[] | Signal<apiClient.apiClient.Article[]> = [];
  displayedColumns: string[] = ['id', 'title', 'content', 'category', 'price', 'actions'];

  constructor(private cart: CartService, private router: Router) {}

  addToCart(article: apiClient.apiClient.Article, event?: Event) {
    if (event) event.stopPropagation();
    if (!article?.id) return;
    this.cart.addItem(article.id, 1).subscribe({ next: () => {}, error: () => {} });
  }

  goTo(article: apiClient.apiClient.Article) {
    if (!article?.id) return;
    this.router.navigate(['/articles', article.id]);
  }

  get articlesList(): apiClient.apiClient.Article[] {
    if (typeof this.articles === 'function') {
      return this.articles();
    }
    return this.articles;
  }
}
