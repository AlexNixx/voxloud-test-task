import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SearchCityService } from '../services';

import { SearchCityComponent } from './search-city.component';

describe('SearchCityComponent', () => {
  let component: SearchCityComponent;
  let fixture: ComponentFixture<SearchCityComponent>;
  let loader: HarnessLoader;

  const citiesFixture = [{ name: 'Kyiv' }, { name: 'Lviv' }, { name: 'Berlin' }];
  let searchCityService: jasmine.SpyObj<SearchCityService>;

  beforeEach(() => {
    searchCityService = jasmine.createSpyObj('SearchCityService', ['getCities']);

    TestBed.configureTestingModule({
      imports: [SearchCityComponent, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [{ provide: SearchCityService, useValue: searchCityService }],
    }).compileComponents();

    searchCityService.getCities.and.returnValue(of(citiesFixture));

    fixture = TestBed.createComponent(SearchCityComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  describe('init', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('ui', () => {
    it('should display cities in autocomplete dropdown', async () => {
      const inputHarness = await loader.getHarness(MatInputHarness);
      const autocompleteHarness = await loader.getHarness(MatAutocompleteHarness);

      await inputHarness.setValue('Kyi');
      fixture.detectChanges();

      const options = await autocompleteHarness.getOptions();
      const optionTexts = await Promise.all(options.map(option => option.getText()));

      expect(optionTexts).toEqual(['Kyiv', 'Lviv', 'Berlin']);
    });
  });

  describe('component', () => {
    it('should emit selected city when an option is clicked', async () => {
      spyOn(component.selected, 'emit');

      const inputHarness = await loader.getHarness(MatInputHarness);
      const autocompleteHarness = await loader.getHarness(MatAutocompleteHarness);

      await inputHarness.setValue('Kyi');
      fixture.detectChanges();

      const cityIndex = 0;
      const options = await autocompleteHarness.getOptions();
      await options[cityIndex].click();

      expect(component.selected.emit).toHaveBeenCalledWith(citiesFixture[cityIndex].name);
    });

    it('should not call service if fewer than 3 characters are typed', async () => {
      const inputHarness = await loader.getHarness(MatInputHarness);
      await inputHarness.setValue('Ky');
      expect(searchCityService.getCities).not.toHaveBeenCalled();
    });

    it('should not call service if control value nullable', async () => {
      component.control.patchValue(null);
      expect(searchCityService.getCities).not.toHaveBeenCalled();
    });

    it('should close autocomplete if get cities throw error', async () => {
      searchCityService.getCities.and.returnValue(throwError(() => new Error()));

      const inputHarness = await loader.getHarness(MatInputHarness);
      const autocompleteHarness = await loader.getHarness(MatAutocompleteHarness);

      await inputHarness.setValue('Kyi');
      fixture.detectChanges();

      const isOpen = await autocompleteHarness.isOpen();
      expect(isOpen).toBeFalse();
    });
  });
});
