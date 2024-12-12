import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { CurrentWeatherResponse, ForecastResponse, DeepPartial } from '../model';
import { ENV, EnvironmentConfig } from '../env';

import { WeatherApiService } from './weather-api.service';

describe('WeatherApiService', () => {
  let service: WeatherApiService;
  let httpMock: HttpTestingController;

  const envFixture: DeepPartial<EnvironmentConfig> = {
    thirdParty: {
      openWeatherMapKey: 'test-openweathermap-key',
    },
  };
  const currentWeatherFixture: (name: string) => CurrentWeatherResponse = name => ({
    weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
    main: {
      temp: 22.5,
      feels_like: 21.7,
      temp_min: 21,
      temp_max: 23,
      humidity: 40,
    },
    visibility: 10000,
    wind: { speed: 5.1 },
    clouds: { all: 0 },
    dt: 1697647200,
    sys: {
      country: 'DE',
      sunrise: 1697613600,
      sunset: 1697654400,
    },
    id: 2950159,
    name,
  });
  const forecastFixture: ForecastResponse = {
    list: [currentWeatherFixture('Kyiv')],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WeatherApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ENV, useValue: envFixture },
      ],
    });

    service = TestBed.inject(WeatherApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve current weather for a city', () => {
    const city = 'Berlin';

    service.getCurrentWeather(city).subscribe(response => expect(response).toEqual(currentWeatherFixture(city)));

    const req = httpMock.expectOne(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=test-openweathermap-key`
    );
    expect(req.request.method).toBe('GET');
    req.flush(currentWeatherFixture(city));
  });

  it('should retrieve the weather forecast for a city', () => {
    const city = 'Kyiv';

    service.getForecast(city).subscribe(response => expect(response).toEqual(forecastFixture));

    const req = httpMock.expectOne(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=test-openweathermap-key`
    );
    expect(req.request.method).toBe('GET');
    req.flush(forecastFixture);
  });
});
