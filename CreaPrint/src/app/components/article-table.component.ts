import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { apiClient } from '../api-client';

@Component({
  selector: 'app-article-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  template: `
    <table mat-table [dataSource]="articles" class="mat-elevation-z1" style="width:100%;min-width:600px;">
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
  `
})
export class ArticleTableComponent {
  @Input() articles: apiClient.Article[] = [];
  @Input() selectArticle!: (article: apiClient.Article) => void;
  displayedColumns: string[] = ['title', 'content', 'category'];
}
