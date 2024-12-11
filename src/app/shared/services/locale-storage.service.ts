import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocaleStorageService {
  public saveData(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public getData<T>(key: string): T {
    const data = localStorage.getItem(key);

    return data ? JSON.parse(data) : null;
  }

  public removeData(key: string): void {
    localStorage.removeItem(key);
  }
}
