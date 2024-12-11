import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDateTime',
  standalone: true,
})
export class FormatDateTimePipe implements PipeTransform {
  transform(value: Date | string | number, format: 'full' | 'shortDate' | 'time' = 'full'): string {
    if (!value) {
      return '';
    }

    const date = typeof value === 'number' ? new Date(value * 1000) : new Date(value);

    switch (format) {
      case 'full':
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
      case 'shortDate':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case 'time':
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
      default:
        return date.toLocaleString();
    }
  }
}
