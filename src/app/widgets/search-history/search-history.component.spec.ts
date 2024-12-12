import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipHarness, MatChipRemoveHarness } from '@angular/material/chips/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { of } from 'rxjs';

import { HistoryService } from '../../shared/services';

import { SearchHistoryComponent } from './search-history.component';

describe('SearchHistoryComponent', () => {
  let component: SearchHistoryComponent;
  let fixture: ComponentFixture<SearchHistoryComponent>;
  let loader: HarnessLoader;

  const cities = ['Kyiv', 'Lviv', 'Berlin'];
  let historyService = jasmine.createSpyObj('HistoryService', ['remove'], {
    cities: signal(['Kyiv', 'Lviv', 'Berlin']),
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SearchHistoryComponent, MatIconModule, MatChipsModule],
      providers: [{ provide: HistoryService, useValue: historyService }],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchHistoryComponent);
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
    it('should display the list of cities as chips', async () => {
      const chips = await loader.getAllHarnesses(MatChipHarness);
      expect(chips.length).toBe(3);

      const chipTexts = await Promise.all(chips.map(chip => chip.getText()));
      expect(chipTexts).toEqual(cities);
    });
  });

  describe('component', () => {
    it('should trigger remove fn when the remove button is clicked', async () => {
      const cityIndex = 0;
      const removeButtons = await loader.getAllHarnesses(MatChipRemoveHarness);

      await removeButtons[cityIndex].click();

      expect(historyService.remove).toHaveBeenCalledWith(cities[cityIndex]);
    });

    it('should emit the selected city when a chip is clicked', async () => {
      spyOn(component['selected'], 'emit');

      const cityIndex = 0;
      fixture.debugElement.queryAll(By.css('[data-test-id=chip]'))[cityIndex].nativeElement.click();

      expect(component['selected'].emit).toHaveBeenCalledWith(cities[cityIndex]);
    });
  });
});
