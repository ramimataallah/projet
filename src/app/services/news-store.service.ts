import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NewsArticle } from './news.service';

@Injectable({ providedIn: 'root' })
export class NewsStoreService {
  private articles$ = new BehaviorSubject<NewsArticle[]>([]);

  setArticles(items: NewsArticle[]) {
    this.articles$.next(items || []);
  }

  getArticles(): Observable<NewsArticle[]> {
    return this.articles$.asObservable();
  }

  getArticleByIndex(i: number): NewsArticle | undefined {
    return this.articles$.getValue()[i];
  }
}
