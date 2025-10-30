import { Component, Input, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { RouterLink } from '@angular/router';
import * as apiClient from '../../api-client';

@Component({
  selector: 'app-article-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, RouterLink],
  template: `
  <table mat-table [dataSource]="articlesList" matSort class="mat-elevation-z1" style="width:100%;min-width:600px;">
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
        <td mat-cell *matCellDef="let article">{{ article.id }}</td>
      </ng-container>
      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Titre</th>
        <td mat-cell *matCellDef="let article">
          <a [routerLink]="['/articles', article.id]">{{ article.title }}</a>
        </td>
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
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  `
})
export class ArticleTableComponent {
  @Input() articles: apiClient.apiClient.Article[] | Signal<apiClient.apiClient.Article[]> = [];
  displayedColumns: string[] = ['id', 'title', 'content', 'category', 'price'];

  get articlesList(): apiClient.apiClient.Article[] {
    if (typeof this.articles === 'function') {
      return this.articles();
    }
    return this.articles;
  }
}
