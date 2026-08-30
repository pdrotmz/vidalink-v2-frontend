import { Routes } from '@angular/router';

import { AuthenticatedLayout } from './layouts/authenticated-layout/authenticated-layout';
import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';
import { Marketplace } from './features/marketplace/pages/marketplace/marketplace';
import { authGuard } from './core/guards/auth-guard';
import { AssessmentPage } from './features/assessment/pages/assessment/assessment';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login')
        .then(m => m.Login),
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register/register')
        .then(m => m.Register),
  },

  {
    path: '',
    component: AuthenticatedLayout,
    canActivate: [authGuard],
    children: [
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
        component: AssessmentPage,
    },
    ],
  },
];