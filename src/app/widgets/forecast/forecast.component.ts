import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DecimalPipe, NgOptimizedImage } from '@angular/common';

import { FormatDateTimePipe } from '../../shared/pipes';
import { ForecastResponse } from '../../shared/model';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

const listAnimation = trigger('listAnimation', [
  transition(':enter', [
    query(':enter', [style({ opacity: 0 }), stagger('100ms', animate('800ms ease-in', style({ opacity: 1 })))]),
  ]),
]);

@Component({
  selector: 'forecast',
  templateUrl: './forecast.component.html',
  styleUrl: './forecast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  animations: [listAnimation],
  imports: [FormatDateTimePipe, NgOptimizedImage, DecimalPipe],
})
export class ForecastComponent {
  public forecast = input.required<ForecastResponse>();

  protected getIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }
}
