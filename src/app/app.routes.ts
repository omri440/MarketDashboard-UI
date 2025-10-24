// app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth_guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login').then(m => m.LoginComponent),
    data: { title: 'Login - Market Dashboard' }
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/dashboard/home/home').then(m => m.Home),
        data: { title: 'Dashboard' }
      },
      {
        path: 'journal',
        loadComponent: () =>
          import('./components/dashboard/journal/journal').then(m => m.Journal),
        data: { title: 'Trading Journal' }
      },
      {
        path: 'scanner',
        loadComponent: () =>
          import('./components/dashboard/scanner/scanner').then(m => m.ScannerComponent),
        data: { title: 'Market Scanner' }
      },
      {
        path: 'portfolio',
        loadComponent: () =>
          import('./components/dashboard/portfolio/portfolio').then(m => m.Portfolio),
        data: { title: 'Portfolio' }
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./components/dashboard/analytics/analytics').then(m => m.Analytics),
        data: { title: 'Analytics' }
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./components/dashboard/settings/settings').then(m => m.Settings),
        data: { title: 'Settings' }
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];