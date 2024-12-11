import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError, switchMap, catchError, tap } from 'rxjs';

import { SearchCityResponse } from '../model';

import { SearchCityApiService } from './search-city-api.service';

@Injectable({
  providedIn: 'root',
})
export class SearchCityService {
  private readonly api = inject(SearchCityApiService);

  private token: string | null = null;

  private getToken(): Observable<string> {
    return this.api.getAuthToken().pipe(tap(token => (this.token = token)));
  }

  public getCities(keyword: string): Observable<SearchCityResponse[]> {
    const makeCityRequest = (): Observable<SearchCityResponse[]> =>
      this.api.getCities(keyword, this.token!).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.token = null;

            return this.getToken().pipe(switchMap(() => makeCityRequest()));
          }

          return throwError(() => error);
        })
      );

    return this.token ? makeCityRequest() : this.getToken().pipe(switchMap(() => makeCityRequest()));
  }
}
