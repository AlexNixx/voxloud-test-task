import { TestBed } from '@angular/core/testing';

import { SearchCityResponse } from '../model';

import { SearchCityApiService } from './search-city-api.service';
import { SearchCityService } from './search-city.service';

describe('SearchCityService', () => {
  let service: SearchCityService;

  const token = 'Bearer access-token';
  const citiesFixture: SearchCityResponse[] = [{ name: 'Kyiv' }, { name: 'Lviv' }, { name: 'Berlin' }];
  let api: jasmine.SpyObj<SearchCityApiService>;

  beforeEach(() => {
    api = jasmine.createSpyObj('SearchCityApiService', ['getAuthToken', 'getCities']);

    api.getAuthToken.and.returnValue(of(token));
    api.getCities.and.returnValue(of(citiesFixture));

    TestBed.configureTestingModule({
      providers: [SearchCityService, { provide: SearchCityApiService, useValue: api }],
    });

    service = TestBed.inject(SearchCityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get token to receive cities', () => {
    expect(service['token']).toEqual(null);

    service.getCities('Kyi').subscribe(() => {
      expect(api['getAuthToken']).toHaveBeenCalled();
      expect(service['token']).toEqual(token);
    });
  });

  it('should receive cities after the token update', () => {
    expect(service['token']).toEqual(null);

    service.getCities('Kyi').subscribe(cities => {
      expect(api['getAuthToken']).toHaveBeenCalled();
      expect(cities).toEqual(citiesFixture);
    });
  });

  it('should directly receive cities if the token is present', () => {
    service['token'] = token;

    service.getCities('Kyi').subscribe(cities => {
      expect(api['getAuthToken']).not.toHaveBeenCalled();
      expect(api.getCities).toHaveBeenCalled();
      expect(cities).toEqual(citiesFixture);
    });
  });

  it('should refresh token and get cities if 401', () => {
    service['token'] = 'invalid-token';

    api.getCities.and.returnValues(
      throwError(() => ({ status: 401 })),
      of(citiesFixture)
    );
    api.getAuthToken.and.returnValue(of(token));

    service.getCities('Kyi').subscribe(cities => {
      expect(service['token']).toEqual(token);
      expect(cities).toEqual(citiesFixture);

      expect(api.getCities).toHaveBeenCalledTimes(2);
      expect(api['getAuthToken']).toHaveBeenCalledTimes(1);
    });
  });

  it('should throw an error if the status is not 401', () => {
    const error = { status: 404 };
    api.getCities.and.returnValue(throwError(() => error));

    service.getCities('Kyi').subscribe({
      error: err => expect(err).toEqual(error),
    });
  });
});
