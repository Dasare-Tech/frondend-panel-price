import { LoginComponent } from './components/login.component';
import { Routes } from '@angular/router';
import { authGuard } from './config/auth.guard';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then((p) => p.DashboardComponent),
    canActivate: [authGuard],
    title: 'Dashboard'
  }
];
