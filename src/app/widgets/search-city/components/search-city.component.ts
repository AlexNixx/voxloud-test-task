import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, defer, filter, map, of, switchMap, tap } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';

import { SearchCityService } from '../services';

@Component({
  selector: 'search-city',
  templateUrl: './search-city.component.html',
  styleUrl: './search-city.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    AsyncPipe,
    ReactiveFormsModule,
  ],
})
export class SearchCityComponent {
  private readonly service = inject(SearchCityService);

  public selected = output<string>();
  public loading = signal<boolean>(false);

  public control = new FormControl('');

  protected readonly cities$ = defer(() =>
    this.control.valueChanges.pipe(
      map(value => value?.trim() ?? ''),
      filter(value => value.length >= 3),
      debounceTime(300),
      tap(() => this.loading.set(true)),
      switchMap(keyword => this.service.getCities(keyword).pipe(catchError(() => of([])))),
      tap(() => this.loading.set(false))
    )
  );

  protected onCitySelected(city: string) {
    this.selected.emit(city);
  }
}
