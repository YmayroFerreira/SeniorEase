import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      {
        path: 'inicio',
        loadComponent: () =>
          import('./features/dashboard-ds2/dashboard-ds2.component').then(
            (m) => m.DashboardDs2Component,
          ),
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./features/profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'acessibilidade',
        loadComponent: () =>
          import('./features/accessibility/accessibility.component').then(
            (m) => m.AccessibilityComponent,
          ),
      },
      {
        path: 'sala-de-espera',
        loadComponent: () =>
          import('./features/waiting-room/waiting-room.component').then(
            (m) => m.WaitingRoomComponent,
          ),
      },
      {
        path: 'aula',
        loadComponent: () =>
          import('./features/active-lesson-session/active-lesson-session.component').then(
            (m) => m.ActiveLessonSessionComponent,
          ),
      },
      {
        path: 'meu-caderno',
        loadComponent: () =>
          import('./features/notebook/notebook.component').then((m) => m.NotebookComponent),
      },
      {
        path: 'minhas-atividades',
        loadComponent: () =>
          import('./features/activity-wizard/activity-wizard.component').then(
            (m) => m.ActivityWizardComponent,
          ),
      },
      {
        path: 'forum',
        loadComponent: () =>
          import('./features/forum-chat/forum-chat.component').then((m) => m.ForumChatComponent),
      },
      {
        path: 'trabalho-final',
        loadComponent: () =>
          import('./features/final-work/final-work.component').then((m) => m.FinalWorkComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
