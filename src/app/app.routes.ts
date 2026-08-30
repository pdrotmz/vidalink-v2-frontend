import { Routes } from '@angular/router';
import { Home } from './features/home/pages/home/home';
import { AuthenticatedLayout } from './layouts/authenticated-layout/authenticated-layout';
import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';
import { Marketplace } from './features/marketplace/pages/marketplace/marketplace';

export const routes: Routes = [
    {
        path: '',
        component: AuthenticatedLayout,
        children: [
            {
                path: '',
                component: Home,
            },
            {
                path: 'dashboard',
                component: Dashboard
            },
            {
                path: 'marketplace',
                component: Marketplace
            },
            {
                path: 'register',
                loadComponent: () => import('./features/auth/pages/register/register').then(m => m.Register)
            },
            {
                path: 'login',
                loadComponent: () => import('./features/auth/pages/login/login').then(m => m.Login)
            }
        ],
    }
];
