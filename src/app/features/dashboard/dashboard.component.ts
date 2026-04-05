import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBookOpen,
  faBriefcase,
  faCalendarCheck,
  faCheckCircle,
  faChevronRight,
  faClipboard,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  AccessibilityService,
  BadgeComponent,
  ButtonComponent,
  CardButtonComponent,
  DividerComponent,
  IconComponent,
} from '@senior-ease/ui';
import { VoiceReadDirective } from '../../shared/directives/voice-read.directive';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    VoiceReadDirective,
    IconComponent,
    BadgeComponent,
    ButtonComponent,
    TranslatePipe,
    CardButtonComponent,
    DividerComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  protected readonly accessibility = inject(AccessibilityService);
  protected readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  protected isWorkSubmitted = true;

  protected readonly wizardTotal = 4;
  protected readonly wizardCompleted = signal(this.loadWizardCompleted());

  protected readonly activitiesAriaLabel = computed(() =>
    this.translate.instant('DASHBOARD.ACTIVITIES_ARIA', {
      completed: this.wizardCompleted(),
      total: this.wizardTotal,
    }),
  );

  private loadWizardCompleted(): number {
    try {
      const raw = localStorage.getItem('wizard-completed-activities');
      if (!raw) return 0;
      return (JSON.parse(raw) as string[]).length;
    } catch {
      return 0;
    }
  }

  protected readonly icons = {
    calendar: faCalendarCheck,
    study: faBookOpen,
    work: faBriefcase,
    chevronRight: faChevronRight,
    check: faCheckCircle,
    clipboard: faClipboard,
    clock: faClock,
  };
}
