import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DecimalPipe, NgOptimizedImage, TitleCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { CurrentWeatherResponse } from '../../shared/model';
import { FormatDateTimePipe } from '../../shared/pipes';

@Component({
  selector: 'current-weather',
  templateUrl: './current-weather.component.html',
  styleUrl: './current-weather.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DecimalPipe, FormatDateTimePipe, MatIconModule, NgOptimizedImage, TitleCasePipe],
})
export class CurrentWeatherComponent {
  public weather = input.required<CurrentWeatherResponse>();

  protected getIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@4x.png`;
  }
}
