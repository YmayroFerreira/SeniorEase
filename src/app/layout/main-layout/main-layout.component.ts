import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faHouse,
  faUniversalAccess,
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
    { path: '/acessibilidade', icon: faUniversalAccess, label: 'Acesso' },
    { path: '/perfil', icon: faUser, label: 'Perfil' },
  ];

  protected readonly sidebarItems: NavItem[] = [
    { path: '/inicio', icon: faHouse, label: 'Início' },

    { path: '/acessibilidade', icon: faUniversalAccess, label: 'Acessibilidade' },
    { path: '/perfil', icon: faUser, label: 'Perfil' },
  ];
}
