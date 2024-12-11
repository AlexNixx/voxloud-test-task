import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard').then(m => m.DashboardComponent),
    children: [
      {
        path: ':city',
        loadComponent: () => import('./city-details').then(m => m.CityDetailsComponent),
      },
    ],
  },
];
