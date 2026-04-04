import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DashboardLayoutComponent, NavItemData, SidebarComponent } from '@senior-ease/ui';
import { filter, map, merge, startWith } from 'rxjs';
import { AccessibilityService } from '../../core/services/accessibility.service';
import { AuthService } from '../../core/services/auth.service';
import { VoiceReadDirective } from '../../shared/directives/voice-read.directive';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    SidebarComponent,
    DashboardLayoutComponent,
    TranslatePipe,
    DatePipe,
    VoiceReadDirective,
  ],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {
  private readonly accessibilityService = inject(AccessibilityService);
  private readonly authService = inject(AuthService);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);

  protected readonly today = new Date();

  protected readonly userName = computed(() => {
    return localStorage.getItem('profile-name') || this.authService.getUserName() || '';
  });

  protected readonly userInitials = computed(() => {
    const name = this.userName();
    if (!name) return '';
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('');
  });

  protected readonly isDashboard = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url === '/inicio'),
      startWith(this.router.url === '/inicio'),
    ),
    { initialValue: this.router.url === '/inicio' },
  );

  private readonly langChange = toSignal(
    merge(
      this.translate.onLangChange.pipe(map((e) => e.lang)),
      this.translate.onTranslationChange.pipe(map((e) => e.lang)),
    ),
    { initialValue: this.translate.getCurrentLang() },
  );

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
      {
        label: this.translate.instant('NAV.LOGOUT'),
        path: '/logout',
        icon: faRightFromBracket,
        description: this.translate.instant('NAV.LOGOUT_DESC'),
        ariaLabel: this.translate.instant('NAV.LOGOUT_ARIA'),
      },
    ];
  });

  private readonly simplifiedPaths = new Set(['/inicio', '/acessibilidade', '/perfil', '/logout']);

  protected readonly navItems = computed(() => {
    if (this.accessibilityService.simplifiedNav()) {
      return this.allNavItems().filter((item) =>
        this.simplifiedPaths.has(item.path?.toString() ?? ''),
      );
    }
    return this.allNavItems();
  });
}
