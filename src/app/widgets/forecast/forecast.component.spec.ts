import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DecimalPipe } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormatDateTimePipe } from '../../shared/pipes';
import { forecastFixture } from '../../shared/test';

import { ForecastComponent } from './forecast.component';

describe('ForecastComponent', () => {
  let component: ForecastComponent;
  let fixture: ComponentFixture<ForecastComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ForecastComponent, DecimalPipe, FormatDateTimePipe, NgOptimizedImage, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ForecastComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('forecast', forecastFixture);
    fixture.detectChanges();
  });

  describe('init', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('ui', () => {
    it('should display all forecast cards', () => {
      const forecastItems = fixture.debugElement.queryAll(By.css('[data-test-id="forecast-item"]'));
      expect(forecastItems.length).toBe(forecastFixture.list.length);
    });
  });

  it('should display forecast items with correct data', () => {
    const forecastItems = fixture.debugElement.queryAll(By.css('[data-test-id="forecast-item"]'));

    forecastItems.forEach((forecastItem, index) => {
      expect(forecastItem.query(By.css('[data-test-id=short-date]')).nativeElement.textContent).toContain(
        FormatDateTimePipe.prototype.transform(forecastFixture.list[index].dt, 'shortDate')
      );
      expect(forecastItem.query(By.css('[data-test-id=time]')).nativeElement.textContent).toContain(
        FormatDateTimePipe.prototype.transform(forecastFixture.list[index].dt, 'time')
      );
      expect(forecastItem.query(By.css('[data-test-id=icon]')).nativeElement.getAttribute('src')).toContain(
        `https://openweathermap.org/img/wn/${forecastFixture.list[index].weather[0].icon}@2x.png`
      );
      expect(forecastItem.query(By.css('[data-test-id=temp]')).nativeElement.textContent).toContain(
        `${DecimalPipe.prototype.transform(forecastFixture.list[index].main.temp, '1.0-1', 'en-US')}°C`
      );
    });
  });

  it('should display weather icon with correct alt text', () => {
    const elementIndex = 0;
    const imgElement = fixture.debugElement.queryAll(By.css('[data-test-id=icon]'))[elementIndex].nativeElement;
    expect(imgElement.alt).toBe(forecastFixture.list?.[elementIndex].weather?.[0].description);
  });

  it('should render animation on forecast list', () => {
    const forecastList = fixture.debugElement.query(By.css('[data-test-id=forecast]')).nativeElement;
    expect(forecastList.getAttribute('@listAnimation')).toBeDefined();
  });
});
