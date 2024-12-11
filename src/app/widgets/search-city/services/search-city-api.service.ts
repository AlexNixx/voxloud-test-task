import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ENV } from '../../../shared/env';
import { SearchCityResponse, TokenResponse } from '../model';

@Injectable({
  providedIn: 'root',
})
export class SearchCityApiService {
  private readonly http = inject(HttpClient);
  private readonly env = inject(ENV);

  private readonly baseUrl = 'https://test.api.amadeus.com/v1';
  private readonly clientId = this.env.thirdParty.amadeus.clientId;
  private readonly clientSecret = this.env.thirdParty.amadeus.clientSecret;

  public getAuthToken(): Observable<string> {
    const body = new HttpParams()
      .set('grant_type', 'client_credentials')
      .set('client_id', this.clientId)
      .set('client_secret', this.clientSecret);

    return this.http
      .post<TokenResponse>(`${this.baseUrl}/security/oauth2/token`, body.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .pipe(map((res: TokenResponse) => `${res.token_type} ${res.access_token}`));
  }

  public getCities(keyword: string, token: string): Observable<SearchCityResponse[]> {
    return this.http
      .get<{ data: SearchCityResponse[] }>(`${this.baseUrl}/reference-data/locations/cities`, {
        headers: { Authorization: token },
        params: { keyword, max: 15 },
      })
      .pipe(map(response => response.data));
  }
}
