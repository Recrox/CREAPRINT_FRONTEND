import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Article } from '../models/article.model';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private articles: Article[] = [
    { id: 1, title: 'Premier article', content: 'Contenu du premier article.' },
    { id: 2, title: 'Deuxième article', content: 'Un autre contenu intéressant.' }
  ];

  private subject = new BehaviorSubject<Article[]>(this.articles.slice());

  list(): Observable<Article[]> {
    return this.subject.asObservable();
  }

  get(id: number): Observable<Article | undefined> {
    return of(this.articles.find(a => a.id === id));
  }

  create(title: string, content: string): Observable<Article> {
    const a: Article = { id: Date.now(), title, content };
    this.articles.push(a);
    this.subject.next(this.articles.slice());
    return of(a);
  }

  update(id: number, data: Partial<Article>): Observable<Article | undefined> {
    const idx = this.articles.findIndex(a => a.id === id);
    if (idx === -1) return of(undefined);
    this.articles[idx] = { ...this.articles[idx], ...data };
    this.subject.next(this.articles.slice());
    return of(this.articles[idx]);
  }

  delete(id: number): Observable<boolean> {
    const idx = this.articles.findIndex(a => a.id === id);
    if (idx === -1) return of(false);
    this.articles.splice(idx, 1);
    this.subject.next(this.articles.slice());
    return of(true);
  }
}
