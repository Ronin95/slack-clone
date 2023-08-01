// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class NewsApiService {
//   constructor(private _http: HttpClient) {}

//   topNews='https://newsapi.org/v2/top-headlines?country=us&apiKey=b02eff65c4ec49e6ab3d94de785f7662'

//   /**
//    * The `topHeadlines()` method is a function that makes an HTTP GET request to the `topNews` URL and returns an Observable.
//    * The `Observable<any>` indicates that the method will return an Observable that emits values of any type.
//    * 
//    * @method
//    * @name topHeadlines
//    * @kind method
//    * @memberof NewsApiService
//    * @returns {Observable<any>}
//    */
//   topHeadlines(): Observable<any> {
//       return this._http.get(this.topNews);
//   }
// }
