import { enableProdMode, isDevMode, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication, enableDebugTools } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { environment } from './environments/environment';

import { RootComponent } from './app/root.component';
import { routes } from './app/routes';
import { ENV } from './app/shared/env';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(RootComponent, {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(),
    {
      provide: ENV,
      useFactory: () => environment.apis,
    },
  ],
}).then(app => isDevMode() && enableDebugTools(app.components[0]));
