import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NewsService, NewsArticle } from '../../services/news.service';
import { NewsStoreService } from '../../services/news-store.service';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit {
  articles: NewsArticle[] = [];
  loading = false;
  error: string | null = null;

  constructor(private news: NewsService, private store: NewsStoreService) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch() {
    this.loading = true;
    this.error = null;
    this.news.getTopHeadlines().subscribe({
      next: (items) => {
        this.articles = items;
        // persist latest articles so detail route can read them
        this.store.setArticles(items);
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Failed to load news';
        this.loading = false;
      }
    });
  }
}
