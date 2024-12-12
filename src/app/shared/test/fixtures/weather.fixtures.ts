import { CurrentWeatherResponse, ForecastResponse, Weather } from '../../model';

export const currentWeatherFixtures: (name?: string, country?: string, temp?: number) => CurrentWeatherResponse = (
  name = 'Kyiv',
  country = 'UA',
  temp = 25.5
) => ({
  name,
  id: 703448,
  weather: [
    {
      id: 800,
      main: 'Clear',
      description: 'clear sky',
      icon: '01d',
    },
  ],
  main: {
    temp,
    feels_like: 26.0,
    temp_min: 22.0,
    temp_max: 28.0,
    humidity: 40,
  },
  visibility: 10000,
  wind: {
    speed: 3.6,
  },
  clouds: {
    all: 0,
  },
  dt: 1686585600,
  sys: {
    country,
    sunrise: 1686548400,
    sunset: 1686602400,
  },
});

export const forecastFixture: ForecastResponse = {
  list: [
    currentWeatherFixtures('Kyiv', 'UA', 24),
    currentWeatherFixtures('Kyiv', 'UA', 25),
    currentWeatherFixtures('Kyiv', 'UA', 26),
  ],
};

export const weatherFixture: Weather = {
  current: currentWeatherFixtures(),
  forecast: forecastFixture,
};
