import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { NewsStoreService } from '../../services/news-store.service';
import { NewsArticle } from '../../services/news.service';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit {
  article: NewsArticle | null = null;
  notFound = false;

  constructor(private route: ActivatedRoute, private store: NewsStoreService, private router: Router) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(id)) {
      this.notFound = true;
      return;
    }
    const found = this.store.getArticleByIndex(id);
    if (!found) {
      // no article in store: user probably landed here directly — redirect to news list
      this.notFound = true;
      return;
    }
    this.article = found;
  }
}
