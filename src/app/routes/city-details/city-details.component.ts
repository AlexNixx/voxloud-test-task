import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { finalize, map, switchMap, tap } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { TitleCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { ForecastComponent, CurrentWeatherComponent } from '../../widgets';
import { HistoryService, WeatherService } from '../../shared/services';
import { FormatDateTimePipe } from '../../shared/pipes';
import { Weather } from '../../shared/model';

const MIN_CITY_LENGTH = 3;

@Component({
  selector: 'app-city-details',
  templateUrl: './city-details.component.html',
  styleUrl: './city-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatProgressSpinner,
    MatButtonModule,
    TitleCasePipe,
    ForecastComponent,
    CurrentWeatherComponent,
    FormatDateTimePipe,
    MatIconModule,
  ],
})
export class CityDetailsComponent implements OnInit {
  private readonly history = inject(HistoryService);
  private readonly service = inject(WeatherService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public readonly weather = signal<Weather | null>(null);
  public readonly loading = signal<boolean>(false);
  public readonly error = signal<string | null>(null);

  public readonly currentCity = computed(() => this.weather()?.current.name);
  public readonly isSaved = computed(() => {
    if (!this.currentCity()) {
      return false;
    }

    return this.history.cities().includes(this.currentCity()!);
  });

  public readonly currentDate = new Date();

  ngOnInit() {
    this.route.paramMap
      .pipe(
        map(params => params.get('city')),
        tap(() => this.loading.set(true)),
        switchMap(city => {
          if (!city || city.length < MIN_CITY_LENGTH) {
            return this.router.navigate(['/dashboard']);
          }

          return this.service.getWeather(city).pipe(
            tap({
              next: weather => {
                this.weather.set(weather);
                this.error.set(null);
              },
              error: err => this.error.set(err),
            }),
            finalize(() => this.loading.set(false))
          );
        })
      )
      .subscribe();
  }

  protected toggleCityHistory(): void {
    if (this.isSaved()) {
      this.history.remove(this.currentCity()!);
    } else {
      this.history.save(this.currentCity()!);
    }
  }
}
