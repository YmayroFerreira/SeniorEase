import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DashboardLayoutComponent, NavItemData, SidebarComponent } from '@senior-ease/ui';
import { map } from 'rxjs';
import { AccessibilityService } from '../../core/services/accessibility.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, SidebarComponent, DashboardLayoutComponent, TranslatePipe],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {
  private readonly accessibilityService = inject(AccessibilityService);
  private readonly translate = inject(TranslateService);

  private readonly langChange = toSignal(this.translate.onLangChange.pipe(map((e) => e.lang)), {
    initialValue: this.translate.getCurrentLang(),
  });

  private readonly allNavItems = computed<NavItemData[]>(() => {
    this.langChange();
    return [
      {
        label: this.translate.instant('NAV.HOME'),
        path: '/inicio',
        icon: 'home',
        description: this.translate.instant('NAV.HOME_DESC'),
        ariaLabel: this.translate.instant('NAV.HOME_ARIA'),
      },
      {
        label: this.translate.instant('NAV.ACCESSIBILITY'),
        path: '/acessibilidade',
        icon: 'accessibility',
        description: this.translate.instant('NAV.ACCESSIBILITY_DESC'),
        ariaLabel: this.translate.instant('NAV.ACCESSIBILITY_ARIA'),
      },
      {
        label: `${this.translate.instant('NAV.PROFILE')}`,
        path: '/perfil',
        icon: 'user',
        description: this.translate.instant('NAV.PROFILE_DESC'),
        ariaLabel: this.translate.instant('NAV.PROFILE_ARIA'),
      },
    ];
  });

  private readonly simplifiedPaths = new Set(['/inicio', '/acessibilidade', '/perfil']);

  protected readonly navItems = computed(() => {
    if (this.accessibilityService.simplifiedNav()) {
      return this.allNavItems().filter((item) =>
        this.simplifiedPaths.has(item.path?.toString() ?? ''),
      );
    }
    return this.allNavItems();
  });
}
