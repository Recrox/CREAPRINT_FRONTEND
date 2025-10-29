import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../services/article.service';
import { apiClient } from '../api-client';
import { ArticleDetailComponent } from './article-detail.component';

@Component({
  selector: 'app-article-detail-page',
  standalone: true,
  imports: [CommonModule, ArticleDetailComponent],
  template: `
    <app-article-detail [article]="article"></app-article-detail>
    <div *ngIf="loading">Chargement...</div>
    <div *ngIf="!loading && !article">Aucun article trouvé.</div>
  `
})
export class ArticleDetailPageComponent implements OnInit {
  article?: apiClient.Article;
  loading = true;

  constructor(private route: ActivatedRoute, private articleService: ArticleService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.articleService.getArticle(id).subscribe({
        next: (data) => {
          this.article = data;
          this.loading = false;
        },
        error: () => {
          this.article = undefined;
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }
}
