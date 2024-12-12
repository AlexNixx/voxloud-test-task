import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NgOptimizedImage } from '@angular/common';
import { By } from '@angular/platform-browser';

import { FormatDateTimePipe } from '../../shared/pipes';
import { currentWeatherFixtures } from '../../shared/test';

import { CurrentWeatherComponent } from './current-weather.component';
import { DeepPartial } from '../../shared/model';

describe('CurrentWeatherComponent', () => {
  let component: CurrentWeatherComponent;
  let fixture: ComponentFixture<CurrentWeatherComponent>;

  const currentWeather = currentWeatherFixtures();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CurrentWeatherComponent,
        DecimalPipe,
        TitleCasePipe,
        MatIconModule,
        NgOptimizedImage,
        FormatDateTimePipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrentWeatherComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('weather', currentWeather);
    fixture.detectChanges();
  });

  describe('init', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('ui', () => {
    it('should display the temperature, feels like, and description', () => {
      const temp = fixture.debugElement.query(By.css('[data-test-id=temp]')).nativeElement.textContent;
      const description = fixture.debugElement.query(By.css('[data-test-id=description]')).nativeElement.textContent;

      console.log(currentWeather.main.temp);
      expect(temp).toContain(`${DecimalPipe.prototype.transform(currentWeather.main.temp, '1.0-0', 'en-US')}°C`);
      expect(description).toContain(TitleCasePipe.prototype.transform(currentWeather.weather[0].description));
    });

    it('should display visibility, wind speed, humidity, and cloudiness', () => {
      const visibility = fixture.debugElement.query(By.css('[data-test-id=visibility]')).nativeElement.textContent;
      const wind = fixture.debugElement.query(By.css('[data-test-id=wind]')).nativeElement.textContent;
      const humidity = fixture.debugElement.query(By.css('[data-test-id=humidity]')).nativeElement.textContent;
      const cloudiness = fixture.debugElement.query(By.css('[data-test-id=cloudiness]')).nativeElement.textContent;

      expect(visibility).toContain(`${currentWeather.visibility / 1000} km`);
      expect(wind).toContain(`${currentWeather.wind.speed} m/s`);
      expect(humidity).toContain(`${currentWeather.main.humidity} %`);
      expect(cloudiness).toContain(`${currentWeather.clouds.all} %`);
    });

    it('should display sunrise and sunset times', () => {
      const sunrise = fixture.debugElement.query(By.css('[data-test-id=sunrise]')).nativeElement.textContent;
      const sunset = fixture.debugElement.query(By.css('[data-test-id=sunset]')).nativeElement.textContent;

      expect(sunrise).toContain(FormatDateTimePipe.prototype.transform(currentWeather.sys.sunrise, 'time'));
      expect(sunset).toContain(FormatDateTimePipe.prototype.transform(currentWeather.sys.sunset, 'time'));
    });

    it('should display weather icon with correct URL and alt text', () => {
      const imgElement = fixture.debugElement.query(By.css('img')).nativeElement;

      expect(imgElement.getAttribute('src')).toBe(
        `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@4x.png`
      );
      expect(imgElement.getAttribute('alt')).toBe(currentWeather.weather[0].description);
    });
  });
});
