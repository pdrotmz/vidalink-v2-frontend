import { Routes } from '@angular/router';
import { Home } from './features/home/pages/home/home';
import { AuthenticatedLayout } from './layouts/authenticated-layout/authenticated-layout';
import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';

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
            }
        ],
    }
];
