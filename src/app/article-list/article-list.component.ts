import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../services/article.service';
import { Observable } from 'rxjs';
import { Article } from '../models/article.model';

@Component({
  standalone: true,
  selector: 'app-article-list',
  imports: [CommonModule, MatCardModule, MatListModule, MatButtonModule, FormsModule],
  template: `
    <mat-card>
      <mat-card-title>Liste des articles</mat-card-title>
      <mat-card-content>
        <ul mat-list>
          <li mat-list-item *ngFor="let a of articles$ | async">
            <div class="item">
              <h3>{{ a.title }}</h3>
              <p>{{ a.content }}</p>
              <button mat-button color="warn" (click)="delete(a.id)">Supprimer</button>
            </div>
          </li>
        </ul>
        <div class="new">
          <input placeholder="Titre" [(ngModel)]="title" />
          <input placeholder="Contenu" [(ngModel)]="content" />
          <button mat-raised-button color="primary" (click)="create()">Créer</button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`.item { display:flex; gap:12px; align-items:center } .new { margin-top:12px; display:flex; gap:8px }`]
})
export class ArticleListComponent {
  articles$: Observable<Article[]>;
  title = '';
  content = '';

  constructor(private svc: ArticleService) {
    this.articles$ = this.svc.list();
  }

  create() {
    if (!this.title) return;
    this.svc.create(this.title, this.content).subscribe(() => {
      this.title = '';
      this.content = '';
    });
  }

  delete(id: number) {
    this.svc.delete(id).subscribe();
  }
}
