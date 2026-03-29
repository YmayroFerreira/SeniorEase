import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { faTableColumns } from '@fortawesome/free-solid-svg-icons';
import { DashboardLayoutComponent, NavItemData, SidebarComponent } from '@senior-ease/ui';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, SidebarComponent, DashboardLayoutComponent],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {
  protected readonly navItems: NavItemData[] = [
    {
      label: 'Inicio',
      path: '/inicio',
      icon: 'home',
      description: 'Visao geral',
      ariaLabel: 'Navegar para inicio',
    },
    {
      label: 'Acessibilidade',
      path: '/acessibilidade',
      icon: 'accessibility',
      description: 'Preferencias de leitura',
      ariaLabel: 'Navegar para acessibilidade',
    },
    {
      label: 'Perfil',
      path: '/perfil',
      icon: 'user',
      description: 'Configuracoes da conta',
      ariaLabel: 'Navegar para perfil',
    },
    { path: '/dashboardDS', icon: faTableColumns, label: 'Dashboard DS' },
    { path: '/dashboardDS2', icon: faTableColumns, label: 'Dashboard DS2' },
  ];
}
