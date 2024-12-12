import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

import { SearchCityComponent, SearchHistoryComponent } from '../../widgets';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet, SearchCityComponent, SearchHistoryComponent],
})
export class DashboardComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected onSelect(search: string) {
    this.router.navigate([search], { relativeTo: this.route });
  }
}
