import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsApiService {
  constructor(private _http: HttpClient) {}

  topNews='https://newsapi.org/v2/top-headlines?country=us&apiKey=b02eff65c4ec49e6ab3d94de785f7662'

  topHeadlines(): Observable<any> {
      return this._http.get(this.topNews);
  }
}
