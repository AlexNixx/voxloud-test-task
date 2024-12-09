import { bootstrapApplication, enableDebugTools } from '@angular/platform-browser';
import { isDevMode, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { RootComponent } from './app/root.component';
import { routes } from './app/routes';

bootstrapApplication(RootComponent, {
  providers: [provideExperimentalZonelessChangeDetection(), provideRouter(routes), provideAnimationsAsync()],
}).then(app => isDevMode() && enableDebugTools(app.components[0]));
