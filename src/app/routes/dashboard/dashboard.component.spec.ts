import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute, provideRouter, RouterOutlet } from '@angular/router';
import { of } from 'rxjs';

import { SearchCityComponent, SearchHistoryComponent, SearchCityService } from '../../widgets';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let router: Router;
  let route: ActivatedRoute;

  let searchCityService: jasmine.SpyObj<SearchCityService>;

  beforeEach(() => {
    searchCityService = jasmine.createSpyObj('SearchCityService', ['getCities']);

    TestBed.configureTestingModule({
      imports: [DashboardComponent, SearchCityComponent, SearchHistoryComponent, BrowserAnimationsModule],
      providers: [provideRouter([]), { provide: SearchCityService, useValue: searchCityService }],
    }).compileComponents();

    searchCityService.getCities.and.returnValue(of([]));

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);

    fixture.detectChanges();
  });

  describe('init', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('ui', () => {
    it('should render SearchCityComponent', () => {
      const searchCityElement = fixture.debugElement.query(By.css('[data-test-id=search-city]')).nativeElement;
      expect(searchCityElement).toBeTruthy();
    });

    it('should render SearchHistoryComponent', () => {
      const searchHistoryElement = fixture.debugElement.query(By.css('[data-test-id=search-history]')).nativeElement;
      expect(searchHistoryElement).toBeTruthy();
    });

    it('should render the RouterOutlet', () => {
      const routerOutletElement = fixture.debugElement.query(By.directive(RouterOutlet)).nativeElement;
      expect(routerOutletElement).toBeTruthy();
      expect(routerOutletElement.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('child component interaction', () => {
    it('should trigger onSelect when SearchCityComponent emits "selected"', () => {
      const searchCityElement = fixture.debugElement.query(By.css('[data-test-id=search-city]'));

      const navigateSpy = spyOn(router, 'navigate');

      searchCityElement.triggerEventHandler('selected', 'Lviv');

      expect(navigateSpy).toHaveBeenCalledWith(['Lviv'], { relativeTo: route });
    });

    it('should trigger onSelect when SearchHistoryComponent emits "selected"', () => {
      const searchHistoryElement = fixture.debugElement.query(By.css('[data-test-id=search-history]'));

      const navigateSpy = spyOn(router, 'navigate');

      searchHistoryElement.triggerEventHandler('selected', 'Berlin');

      expect(navigateSpy).toHaveBeenCalledWith(['Berlin'], { relativeTo: route });
    });
  });
});
