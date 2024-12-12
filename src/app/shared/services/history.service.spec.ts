import { TestBed } from '@angular/core/testing';
import { HistoryService } from './history.service';
import { LocaleStorageService } from './locale-storage.service';

describe('HistoryService', () => {
  let service: HistoryService;
  let storageService: jasmine.SpyObj<LocaleStorageService>;

  const storedHistory = ['Kyiv', 'Lviv'];

  beforeEach(() => {
    storageService = jasmine.createSpyObj('LocaleStorageService', ['getData', 'saveData', 'removeData']);

    TestBed.configureTestingModule({
      providers: [HistoryService, { provide: LocaleStorageService, useValue: storageService }],
    });
  });

  describe('persist cities', () => {
    it('should initialize with data from storage', () => {
      storageService.getData.and.returnValue(storedHistory);

      service = TestBed.inject(HistoryService);

      expect(service.cities()).toEqual(storedHistory);
      expect(storageService.getData).toHaveBeenCalledWith('voxloud-cities-history');
    });

    it('should initialize with an empty array if no data in storage', () => {
      storageService.getData.and.returnValue(null);

      service = TestBed.inject(HistoryService);

      expect(service.cities()).toEqual([]);
      expect(storageService.getData).toHaveBeenCalledWith('voxloud-cities-history');
    });
  });

  describe('save/remove', () => {
    beforeEach(() => {
      storageService.getData.and.returnValue(storedHistory);
      service = TestBed.inject(HistoryService);
    });

    it('should save a new city and update storage', () => {
      const city = 'San Francisco';
      service.save(city);

      expect(service.cities()).toEqual([...storedHistory, city]);
      expect(storageService.saveData).toHaveBeenCalledWith('voxloud-cities-history', [...storedHistory, city]);
    });

    it('should remove a city and update storage', () => {
      const removedCity = 'Lviv';
      service.remove(removedCity);

      expect(service.cities()).toEqual(['Kyiv']);
      expect(storageService.saveData).toHaveBeenCalledWith('voxloud-cities-history', ['Kyiv']);
    });

    it('should remove the key from storage if the last city is removed', () => {
      storedHistory.forEach(city => service.remove(city));

      expect(service.cities()).toEqual([]);
      expect(storageService.removeData).toHaveBeenCalledWith('voxloud-cities-history');
    });
  });
});
