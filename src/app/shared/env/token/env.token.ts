import { InjectionToken } from '@angular/core';

import { EnvironmentConfig } from '../interfaces/config.interface';

export const ENV = new InjectionToken<EnvironmentConfig>('ENV');
