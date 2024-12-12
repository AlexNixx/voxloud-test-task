import { TestBed } from '@angular/core/testing';
import { LocaleStorageService } from './locale-storage.service';

describe('LocaleStorageService', () => {
  let service: LocaleStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocaleStorageService],
    });
    service = TestBed.inject(LocaleStorageService);
    spyOn(localStorage, 'setItem').and.callFake(() => {});
    spyOn(localStorage, 'getItem').and.callFake(() => null);
    spyOn(localStorage, 'removeItem').and.callFake(() => {});
  });

  it('should save data to localStorage', () => {
    const key = 'testKey';
    const value = { name: 'test' };

    service.saveData(key, value);

    expect(localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
  });

  it('should retrieve data from localStorage', () => {
    const key = 'testKey';
    const value = { name: 'test' };
    (localStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify(value));

    const result = service.getData<typeof value>(key);

    expect(localStorage.getItem).toHaveBeenCalledWith(key);
    expect(result).toEqual(value);
  });

  it('should return null when retrieving non-existent data', () => {
    const key = 'nonExistentKey';
    (localStorage.getItem as jasmine.Spy).and.returnValue(null);

    const result = service.getData(key);

    expect(localStorage.getItem).toHaveBeenCalledWith(key);
    expect(result).toBeNull();
  });

  it('should remove data from localStorage', () => {
    const key = 'testKey';
    service.removeData(key);

    expect(localStorage.removeItem).toHaveBeenCalledWith(key);
  });

  it('should handle invalid JSON in localStorage gracefully', () => {
    const key = 'invalidJSONKey';
    (localStorage.getItem as jasmine.Spy).and.returnValue('invalid JSON');

    expect(() => service.getData(key)).toThrowError(SyntaxError);
  });
});
