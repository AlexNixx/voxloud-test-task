import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, forkJoin, Observable, of, tap, throwError } from 'rxjs';

import { Weather } from '../model';

import { WeatherApiService } from './weather-api.service';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private readonly api = inject(WeatherApiService);

  private readonly cache = new Map<string, Weather>();

  public getWeather(city: string): Observable<Weather> {
    const cacheData = this.cache.get(city);
    if (cacheData) {
      return of(cacheData);
    }

    return forkJoin({
      current: this.api.getCurrentWeather(city),
      forecast: this.api.getForecast(city),
    }).pipe(
      tap(weather => this.cache.set(city, weather)),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return throwError(() => 'City not found');
        }

        return throwError(() => 'Something went wrong!');
      })
    );
  }
}
