import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ENV, EnvironmentConfig } from '../../../shared/env';
import { DeepPartial } from '../../../shared/model';

import { TokenResponse, SearchCityResponse } from '../model';

import { SearchCityApiService } from './search-city-api.service';

describe('SearchCityApiService', () => {
  let service: SearchCityApiService;
  let httpMock: HttpTestingController;

  const envFixture: DeepPartial<EnvironmentConfig> = {
    thirdParty: {
      amadeus: {
        clientId: 'amadeus-client-id',
        clientSecret: 'amadeus-client-secret',
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchCityApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ENV, useValue: envFixture },
      ],
    });

    service = TestBed.inject(SearchCityApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve the auth token', () => {
    const mockTokenResponse: TokenResponse = {
      access_token: 'access-token',
      token_type: 'Bearer',
    };

    const expectedAuthHeader = 'Bearer access-token';

    service.getAuthToken().subscribe((token: string) => {
      expect(token).toBe(expectedAuthHeader);
    });

    const req = httpMock.expectOne('https://test.api.amadeus.com/v1/security/oauth2/token');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(
      'grant_type=client_credentials&client_id=amadeus-client-id&client_secret=amadeus-client-secret'
    );
    req.flush(mockTokenResponse);
  });

  it('should retrieve cities for a keyword', () => {
    const mockCitiesResponse: SearchCityResponse[] = [{ name: 'Paris' }, { name: 'London' }];

    const mockToken = 'Bearer access-token';

    service.getCities('Par', mockToken).subscribe((cities: SearchCityResponse[]) => {
      expect(cities).toEqual(mockCitiesResponse);
    });

    const req = httpMock.expectOne(
      'https://test.api.amadeus.com/v1/reference-data/locations/cities?keyword=Par&max=15'
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(mockToken);
    req.flush({ data: mockCitiesResponse });
  });
});
