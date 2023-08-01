import { Component } from '@angular/core';
// import { NewsApiService } from '../../services/news-api.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent {
  topHeadlines: any[] = [];
  
  // constructor(private newsApi: NewsApiService) {}

  /**
   * The `ngOnInit()` method is a lifecycle hook in Angular that is called after the component has been initialized. In this
   * code, it is used to make an API call to retrieve the top headlines from the `NewsApiService`. The `topHeadlines()`
   * method returns an Observable, and the `subscribe()` method is used to handle the response data. The retrieved data is
   * then assigned to the `topHeadlines` property of the component, which can be used to display the news articles in the
   * template.
   * 
   * @method
   * @name ngOnInit
   * @kind method
   * @memberof NewsComponent
   * @returns {void}
   */
  // ngOnInit() {
  //   this.newsApi.topHeadlines().subscribe((data) => {
  //     this.topHeadlines = data.articles;
  //   });
  // }
}
