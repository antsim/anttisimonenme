import { Routes } from '@angular/router';
import { CvPage } from './pages/cv-page/cv-page';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: Home, title: 'Antti Simonen — Software Architect' },
  { path: 'cv', component: CvPage, title: 'CV — Antti Simonen, Software Architect' },
  { path: '**', redirectTo: '' },
];
