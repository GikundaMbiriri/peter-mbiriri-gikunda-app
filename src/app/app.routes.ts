import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // ── Public: login stands alone (handles its own full-screen layout) ────────
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then((m) => m.LoginComponent),
  },

  // ── Auth layout (navbar + main + footer) — one group, no ambiguity ─────────
  {
    path: '',
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout').then((m) => m.AuthLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./components/user-list/user-list').then((m) => m.UserListComponent),
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
