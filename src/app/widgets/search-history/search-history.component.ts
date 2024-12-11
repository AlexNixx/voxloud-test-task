import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { HistoryService } from '../../shared/services';

@Component({
  selector: 'search-history',
  templateUrl: './search-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatChipsModule, MatIconModule],
})
export class SearchHistoryComponent {
  private readonly history = inject(HistoryService);

  protected selected = output<string>();

  protected cities = this.history.cities;

  protected remove(city: string): void {
    this.history.remove(city);
  }
}
