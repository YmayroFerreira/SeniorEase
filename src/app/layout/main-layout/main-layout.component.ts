import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBook,
  faBookOpen,
  faCalendarDays,
  faChartBar,
  faComments,
  faHandshake,
  faHouse,
  faUser,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

interface NavItem {
  path: string;
  icon: IconDefinition;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FontAwesomeModule],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {
  protected readonly bottomNavItems: NavItem[] = [
    { path: '/inicio', icon: faHouse, label: 'Início' },
    { path: '/agenda', icon: faCalendarDays, label: 'Agenda', disabled: true },
    { path: '/materiais', icon: faBookOpen, label: 'Materiais', disabled: true },
    { path: '/perfil', icon: faUser, label: 'Perfil' },
  ];

  protected readonly sidebarItems: NavItem[] = [
    { path: '/inicio', icon: faHouse, label: 'Início' },
    { path: '/agenda', icon: faCalendarDays, label: 'Agenda', disabled: true },
    { path: '/disciplinas', icon: faBook, label: 'Disciplinas', disabled: true },
    { path: '/materiais', icon: faBookOpen, label: 'Materiais', disabled: true },
    { path: '/forum', icon: faComments, label: 'Fórum', disabled: true },
    { path: '/mentoria', icon: faHandshake, label: 'Mentoria', disabled: true },
    { path: '/relatorios', icon: faChartBar, label: 'Relatórios', disabled: true },
    { path: '/perfil', icon: faUser, label: 'Perfil' },
  ];
}
