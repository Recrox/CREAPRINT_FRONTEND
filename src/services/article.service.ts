import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Client, Article as ApiArticle } from '../api/api-client';
import type { AxiosInstance } from 'axios';

@Injectable({ providedIn: 'root' })
export class ArticleService {
	private client: Client;

	constructor() {
		// default base URL points to your API
		this.client = new Client('https://localhost:44366');
	}

	list(): Observable<ApiArticle[]> {
		return from(this.client.articlesAll());
	}

	get(id: number): Observable<ApiArticle> {
		return from(this.client.articlesGET(id));
	}

	create(article: Partial<ApiArticle>): Observable<ApiArticle> {
		const body = article as ApiArticle;
		return from(this.client.articlesPOST(body));
	}

	update(id: number, article: Partial<ApiArticle>): Observable<ApiArticle> {
		// if your API has an update endpoint, call it here. Placeholder uses create for now.
		return from(this.client.articlesPOST(article as ApiArticle));
	}

	delete(id: number): Observable<boolean> {
		// If delete endpoint exists implement it. For now, return an observable of false.
		return from(Promise.resolve(false));
	}
}
