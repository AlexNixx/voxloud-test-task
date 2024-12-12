import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { weatherFixture } from '../test';

import { WeatherService } from './weather.service';
import { WeatherApiService } from './weather-api.service';

describe('WeatherService', () => {
  let service: WeatherService;
  let apiService: jasmine.SpyObj<WeatherApiService>;

  beforeEach(() => {
    const apiSpy = jasmine.createSpyObj('WeatherApiService', ['getCurrentWeather', 'getForecast']);

    TestBed.configureTestingModule({
      providers: [WeatherService, { provide: WeatherApiService, useValue: apiSpy }],
    });

    service = TestBed.inject(WeatherService);
    apiService = TestBed.inject(WeatherApiService) as jasmine.SpyObj<WeatherApiService>;
  });

  it('should retrieve weather data for a city', done => {
    apiService.getCurrentWeather.and.returnValue(of(weatherFixture.current));
    apiService.getForecast.and.returnValue(of(weatherFixture.forecast));

    service.getWeather('Kyiv').subscribe(weather => {
      expect(weather).toEqual(weatherFixture);
      expect(apiService.getCurrentWeather).toHaveBeenCalledWith('Kyiv');
      expect(apiService.getForecast).toHaveBeenCalledWith('Kyiv');
      done();
    });
  });

  it('should cache weather data for subsequent requests', done => {
    service['cache'].set('Kyiv', weatherFixture);

    service.getWeather('Kyiv').subscribe(weather => {
      expect(weather).toEqual(weatherFixture);
      expect(apiService.getCurrentWeather).not.toHaveBeenCalled();
      expect(apiService.getForecast).not.toHaveBeenCalled();
      done();
    });
  });

  it('should handle a 404 error gracefully', done => {
    apiService.getCurrentWeather.and.returnValue(throwError(() => new HttpErrorResponse({ status: 404 })));
    apiService.getForecast.and.returnValue(of(weatherFixture.forecast));

    service.getWeather('NonexistentCity').subscribe({
      next: () => fail('Expected an error, not weather data'),
      error: error => {
        expect(error).toBe('City not found');
        done();
      },
    });
  });

  it('should handle non-404 errors gracefully', done => {
    apiService.getCurrentWeather.and.returnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
    apiService.getForecast.and.returnValue(of(weatherFixture.forecast));

    service.getWeather('Kyiv').subscribe({
      next: () => fail('Expected an error, not weather data'),
      error: error => {
        expect(error).toBe('Something went wrong!');
        done();
      },
    });
  });
});
