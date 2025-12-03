import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface NewsArticle {
  title: string;
  description?: string;
  url: string;
  image?: string;
  publishedAt?: string;
  source?: { name?: string };
}

@Injectable({ providedIn: 'root' })
export class NewsService {
  private base = 'https://gnews.io/api/v4/top-headlines';
  private apiKey = environment.gnewsApiKey;

  constructor(private http: HttpClient) {}

  getTopHeadlines(category = 'general', lang = 'en', max = 12): Observable<NewsArticle[]> {
    const params = new HttpParams()
      .set('category', category)
      .set('lang', lang)
      .set('max', String(max))
      .set('apikey', this.apiKey);

    return this.http.get<any>(this.base, { params }).pipe(
      map((res) => {
        // GNews returns { articles: [...] }
        return (res?.articles || []).map((a: any) => ({
          title: a.title,
          description: a.description,
          url: a.url,
          image: a.image,
          publishedAt: a.publishedAt,
          source: a.source
        } as NewsArticle));
      })
    );
  }
}
