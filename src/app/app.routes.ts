import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Pokemon } from './pokemon/pokemon';

export const routes: Routes = [
  {
    path: '',
    title: 'Home Page',
    redirectTo: '1',
    pathMatch: 'full',
  },
  {
    path: ':page',
    title: 'Home Page',
    component: Home
  },
  {
    path: 'pokemon/:id',
    title: 'Viewing Pokemon',
    component: Pokemon
  }
];
