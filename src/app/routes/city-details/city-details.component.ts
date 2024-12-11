import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { TitleCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { ForecastComponent, CurrentWeatherComponent } from '../../widgets';
import { HistoryService, WeatherService } from '../../shared/services';
import { FormatDateTimePipe } from '../../shared/pipes';
import { Weather } from '../../shared/model';

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
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
        }),
        switchMap(city => {
          if (!city || city.length < 3) {
            return this.router.navigate(['/dashboard']);
          }

          return this.service.getWeather(city).pipe(
            tap({
              next: weather => this.weather.set(weather),
              error: error => this.error.set(error),
            }),
            tap(() => this.loading.set(false)),
            catchError(() => of(null))
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
