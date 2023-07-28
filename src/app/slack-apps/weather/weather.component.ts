import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { Weather } from '../../../models/weather';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  weather: Weather | undefined;

  constructor(private weatherService: WeatherService) { }

  ngOnInit() {}

  /**
   * The `search(city: string)` method is a function that takes a `city` parameter of type string. It is used to search for
   * weather information for the specified city.
   * 
   * @method
   * @name search
   * @kind method
   * @memberof WeatherComponent
   * @param {string} city
   * @returns {void}
   */
  search(city: string) {
    this.weatherService.getWeather(city).subscribe((weather: Weather) => {
      this.weather = weather;
    });
  }

}
