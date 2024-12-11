import { inject, Injectable, signal } from '@angular/core';

import { LocaleStorageService } from './locale-storage.service';

const HISTORY_KEY = 'voxloud-cities-history';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private readonly storage = inject(LocaleStorageService);

  private _cities = signal<string[]>([]);

  constructor() {
    const history = this.storage.getData<string[] | null>(HISTORY_KEY) ?? [];
    this._cities.set(history);
  }

  public get cities() {
    return this._cities;
  }

  public save(city: string) {
    this._cities.update(values => [...values, city]);

    this.storage.saveData(HISTORY_KEY, this.cities());
  }

  public remove(city: string) {
    this._cities.update(values => values.filter(c => c !== city));

    if (!this.cities().length) {
      this.storage.removeData(HISTORY_KEY);
    } else {
      this.storage.saveData(HISTORY_KEY, this.cities());
    }
  }
}
