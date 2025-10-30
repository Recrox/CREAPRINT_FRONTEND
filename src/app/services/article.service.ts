import { Injectable } from '@angular/core';
import * as apiClient from '../api-client';
import { environment } from '../../environments/environment';
import { sharedAxiosInstance } from './http.service';
import { Observable, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private client: apiClient.apiClient.ApiClient;

  constructor() {
    this.client = new apiClient.apiClient.ApiClient(environment.apiBaseUrl, sharedAxiosInstance);
  }

  getAllArticles(): Observable<apiClient.apiClient.Article[]> {
    return from(this.client.articlesAll());
  }

  getArticle(id: number): Observable<apiClient.apiClient.Article> {
    return from(this.client.articlesGET(id));
  }

  createArticle(article: apiClient.apiClient.Article): Observable<apiClient.apiClient.Article> {
    return from(this.client.articlesPOST(article));
  }

  updateArticle(id: number, article: apiClient.apiClient.Article): Observable<void> {
    return from(this.client.articlesPUT(id, article));
  }

  deleteArticle(id: number): Observable<void> {
    return from(this.client.articlesDELETE(id));
  }

  /**
   * Server-side search by title (uses ApiClient.search)
   */
  search(title?: string): Observable<apiClient.apiClient.Article[]> {
    return from(this.client.search(title));
  }

  getPagedArticles(page: number, pageSize: number): Observable<apiClient.apiClient.Article[]> {
    return from(this.client.paged(page, pageSize));
  }

  count(): Observable<number> {
    return from(this.client.count());
  }
}
