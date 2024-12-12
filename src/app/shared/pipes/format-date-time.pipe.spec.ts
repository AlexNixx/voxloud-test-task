import { FormatDateTimePipe } from './format-date-time.pipe';

describe('FormatDateTimePipe', () => {
  let pipe: FormatDateTimePipe;

  beforeEach(() => {
    pipe = new FormatDateTimePipe();
  });

  it('should return an empty string when value is null or undefined', () => {
    expect(pipe.transform(null as any)).toBe('');
    expect(pipe.transform(undefined as any)).toBe('');
  });

  it('should format the date in "full" format by default', () => {
    const date = new Date('2023-12-25T15:30:00');
    const result = pipe.transform(date);
    expect(result).toBe(
      date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    );
  });

  it('should format the date in "shortDate" format', () => {
    const date = new Date('2023-12-25T15:30:00');
    const result = pipe.transform(date, 'shortDate');
    expect(result).toBe(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  });

  it('should format the date in "time" format', () => {
    const date = new Date('2023-12-25T15:30:00');
    const result = pipe.transform(date, 'time');
    expect(result).toBe(
      date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    );
  });

  it('should handle numeric timestamps as input', () => {
    const timestamp = 1706200200;
    const date = new Date(timestamp * 1000);
    const result = pipe.transform(timestamp, 'full');
    expect(result).toBe(
      date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    );
  });

  it('should handle string date inputs', () => {
    const dateString = '2024-01-01T12:30:00';
    const date = new Date(dateString);
    const result = pipe.transform(dateString, 'shortDate');
    expect(result).toBe(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  });

  it('should return default format when an unsupported format is provided', () => {
    const date = new Date('2024-01-01T12:30:00');
    const result = pipe.transform(date, 'unsupportedFormat' as any);
    expect(result).toBe(date.toLocaleString());
  });
});
