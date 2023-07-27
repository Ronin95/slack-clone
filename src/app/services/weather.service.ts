import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Weather } from '../../models/weather';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private http: HttpClient) { }

  /**
   * The `getWeather` method in the `WeatherService` class is responsible for making an HTTP GET request to retrieve weather
   * data for a specific city.
   * 
   * @method
   * @name getWeather
   * @kind method
   * @memberof WeatherService
   * @param {string} city
   * @returns {Observable<Weather>}
   */
  getWeather(city: string): Observable<Weather> {
    const options = new HttpParams()
      .set('units', 'metric')
      .set('q', city)
      .set('appid', environment.weatherApiKey);
    return this.http.get<Weather>(`${environment.weatherApiUrl}weather`, { params: options});
  }
}
