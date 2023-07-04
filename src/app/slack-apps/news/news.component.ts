import { Component } from '@angular/core';
import { NewsApiService } from '../../services/news-api.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent {
  topHeadlines: any[] = [];
  
  constructor(private newsApi: NewsApiService) {}

  ngOnInit() {
    this.newsApi.topHeadlines().subscribe((data) => {
      console.log(data);
      this.topHeadlines = data.articles;
    });
  }
}
