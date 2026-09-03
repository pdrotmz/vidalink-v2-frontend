import { Routes } from '@angular/router';

import { Home } from './features/home/pages/home/home';
import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';
import { Marketplace } from './features/marketplace/pages/marketplace/marketplace';

import { AuthenticatedLayout } from './layouts/authenticated-layout/authenticated-layout';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';



export const routes: Routes = [
  {
    path: '',
    component: AuthenticatedLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: Home,
      },
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'marketplace',
        component: Marketplace,
      },
      {
        path: 'assessment',
        loadComponent: () =>
          import('./features/assessment/pages/assessment/assessment')
            .then(m => m.AssessmentPage),
      },
    ],
  },

  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/pages/login/login')
        .then(m => m.Login),
  },

  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/pages/register/register')
        .then(m => m.Register),
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];