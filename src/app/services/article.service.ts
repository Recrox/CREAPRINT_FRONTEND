import { Injectable } from '@angular/core';
import { apiClient } from '../api-client';
import { environment } from '../../environments/environment';
import { Observable, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private client: apiClient.ApiClient;

  constructor() {
    this.client = new apiClient.ApiClient(environment.apiBaseUrl);
  }

  getAllArticles(): Observable<apiClient.Article[]> {
    return from(this.client.articlesAll());
  }

  getArticle(id: number): Observable<apiClient.Article> {
    return from(this.client.articlesGET(id));
  }

  createArticle(article: apiClient.Article): Observable<apiClient.Article> {
    return from(this.client.articlesPOST(article));
  }
}
