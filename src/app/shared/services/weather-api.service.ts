import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CurrentWeatherResponse, ForecastResponse } from '../model';
import { ENV } from '../env';

@Injectable({
  providedIn: 'root',
})
export class WeatherApiService {
  private readonly http = inject(HttpClient);
  private readonly env = inject(ENV);

  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5/';
  private readonly key = this.env.thirdParty.openWeatherMapKey;

  public getCurrentWeather(city: string): Observable<CurrentWeatherResponse> {
    return this.http.get<CurrentWeatherResponse>(`${this.baseUrl}/weather`, {
      params: { q: city, units: 'metric', appid: this.key },
    });
  }

  public getForecast(city: string): Observable<ForecastResponse> {
    return this.http.get<ForecastResponse>(`${this.baseUrl}/forecast`, {
      params: { q: city, units: 'metric', appid: this.key },
    });
  }
}
