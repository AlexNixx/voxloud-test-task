import { By } from '@angular/platform-browser';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { of, throwError } from 'rxjs';

import { ForecastComponent, CurrentWeatherComponent } from '../../widgets';
import { HistoryService, WeatherService } from '../../shared/services';
import { FormatDateTimePipe } from '../../shared/pipes';
import { weatherFixture } from '../../shared/test';

import { CityDetailsComponent } from './city-details.component';

describe('CityDetailsComponent', () => {
  let component: CityDetailsComponent;
  let fixture: ComponentFixture<CityDetailsComponent>;
  let mockWeatherService: jasmine.SpyObj<WeatherService>;
  let mockHistoryService: jasmine.SpyObj<HistoryService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;

  beforeEach(async () => {
    mockWeatherService = jasmine.createSpyObj('WeatherService', ['getWeather']);
    mockHistoryService = jasmine.createSpyObj('HistoryService', ['save', 'remove', 'cities'], ['_cities']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockHistoryService['cities'].and.returnValues([]);
    mockActivatedRoute = {
      paramMap: of({
        get: (key: string) => (key === 'city' ? 'London' : null),
      }),
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        CityDetailsComponent,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatIconModule,
        ForecastComponent,
        CurrentWeatherComponent,
        FormatDateTimePipe,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: WeatherService, useValue: mockWeatherService },
        { provide: HistoryService, useValue: mockHistoryService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();
  });

  const persistHistory = (history: string[]) => {
    mockHistoryService['cities'].and.returnValues(history);
  };

  const setParamValue = (city?: string) => {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: jasmine.createSpyObj('ActivatedRoute', [], {
        paramMap: of({ get: (_: string) => city }),
      }),
    });
  };

  const createComponent = () => {
    fixture = TestBed.createComponent(CityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  describe('init', () => {
    beforeEach(() => {
      setParamValue('Kyiv');
      createComponent();
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('params validation', () => {
    it('should navigate to dashboard if city param is undefined', () => {
      setParamValue(undefined);
      createComponent();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should navigate to dashboard if city param length is less than 3', () => {
      setParamValue('Ky');
      createComponent();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
  });

  describe('get weather', () => {
    const city = 'Kyiv';
    beforeEach(() => {
      setParamValue(city);
    });

    it('should fetch and display weather data successfully', () => {
      mockWeatherService.getWeather.and.returnValue(of(weatherFixture));

      createComponent();

      expect(mockWeatherService.getWeather).toHaveBeenCalledWith(city);
      expect(component.weather()).toEqual(weatherFixture);
      expect(component.error()).toBeNull();
      expect(component.loading()).toBeFalse();
    });
  });

  describe('loading', () => {
    beforeEach(() => {
      setParamValue('Kyiv');
    });

    it('should show loading spinner when loading is true', () => {
      createComponent();

      component.loading.set(true);

      expect(fixture.debugElement.query(By.css('[data-test-id=loader]')).nativeElement).toBeTruthy();
      expect(fixture.debugElement.query(By.css('[data-test-id=error]'))).toBeNull();
    });
  });

  describe('errors', () => {
    beforeEach(() => {
      setParamValue('Kyiv');
    });

    it('should display error message if weather service fails', () => {
      const errorMessage = 'Error fetching weather data';
      mockWeatherService.getWeather.and.returnValue(throwError(() => errorMessage));

      createComponent();

      expect(fixture.debugElement.query(By.css('[data-test-id=error]')).nativeElement).toBeTruthy();
      expect(fixture.debugElement.query(By.css('[data-test-id=error]')).nativeElement.textContent).toContain(
        errorMessage
      );
      expect(fixture.debugElement.query(By.css('[data-test-id=loader]'))).toBeNull();
    });
  });

  describe('ui', () => {
    beforeEach(() => {
      mockWeatherService.getWeather.and.returnValue(of(weatherFixture));
      setParamValue('Kyiv');
      createComponent();
    });

    it('should render current weather', () => {
      const currentWeatherElement = fixture.debugElement.query(By.directive(CurrentWeatherComponent)).nativeElement;

      expect(currentWeatherElement).toBeTruthy();
    });

    it('should set forecast input value', () => {
      const currentWeatherElement = fixture.debugElement.query(By.directive(CurrentWeatherComponent));

      expect(currentWeatherElement.componentInstance.weather()).toEqual(weatherFixture.current);
    });

    it('should render forecast', () => {
      const forecastElement = fixture.debugElement.query(By.directive(ForecastComponent)).nativeElement;

      expect(forecastElement).toBeTruthy();
    });

    it('should set forecast input value', () => {
      const forecastElement = fixture.debugElement.query(By.directive(ForecastComponent));

      expect(forecastElement.componentInstance.forecast()).toEqual(weatherFixture.forecast);
    });
  });

  describe('toggle city', () => {
    it('should remove', () => {
      persistHistory([weatherFixture.current.name]);
      mockWeatherService.getWeather.and.returnValue(of(weatherFixture));
      setParamValue(weatherFixture.current.name);
      createComponent();

      const button = fixture.debugElement.query(By.css('[data-test-id=toggle-city]')).nativeElement;
      button.click();

      expect(mockHistoryService.save).not.toHaveBeenCalled();
      expect(mockHistoryService.remove).toHaveBeenCalledWith(weatherFixture.current.name);
    });

    it('should save', () => {
      mockWeatherService.getWeather.and.returnValue(of(weatherFixture));
      setParamValue(weatherFixture.current.name);
      createComponent();

      const button = fixture.debugElement.query(By.css('[data-test-id=toggle-city]')).nativeElement;
      button.click();

      expect(mockHistoryService.save).toHaveBeenCalledWith(weatherFixture.current.name);
      expect(mockHistoryService.remove).not.toHaveBeenCalled();
    });

    it('should not toggle city history if city is null', () => {
      mockWeatherService.getWeather.and.returnValue(
        of({ ...weatherFixture, current: { ...weatherFixture.current, name: null } }) as any
      );
      setParamValue(weatherFixture.current.name);
      createComponent();

      const button = fixture.debugElement.query(By.css('[data-test-id=toggle-city]')).nativeElement;
      button.click();

      expect(mockHistoryService.remove).not.toHaveBeenCalled();
      expect(mockHistoryService.save).not.toHaveBeenCalled();
    });
  });
});
