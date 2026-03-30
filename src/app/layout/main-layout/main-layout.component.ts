import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardLayoutComponent, NavItemData, SidebarComponent } from '@senior-ease/ui';
import { AccessibilityService } from '../../core/services/accessibility.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, SidebarComponent, DashboardLayoutComponent],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {
  private readonly accessibilityService = inject(AccessibilityService);

  private readonly allNavItems: NavItemData[] = [
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
  ];

  private readonly simplifiedPaths = new Set(['/inicio', '/acessibilidade', '/perfil']);

  protected readonly navItems = computed(() => {
    if (this.accessibilityService.simplifiedNav()) {
      return this.allNavItems.filter((item) =>
        this.simplifiedPaths.has(item.path?.toString() ?? ''),
      );
    }
    return this.allNavItems;
  });
}
