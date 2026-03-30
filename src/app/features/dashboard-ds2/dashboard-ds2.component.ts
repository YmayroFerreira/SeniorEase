import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
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
import { BadgeComponent, ButtonComponent, IconComponent } from '@senior-ease/ui';
import { AccessibilityService } from '../../core/services/accessibility.service';
import { VoiceReadDirective } from '../../shared/directives/voice-read.directive';

@Component({
  selector: 'app-dashboard-ds2',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    VoiceReadDirective,
    IconComponent,
    BadgeComponent,
    ButtonComponent,
  ],
  templateUrl: './dashboard-ds2.component.html',
})
export class DashboardDs2Component {
  protected readonly accessibility = inject(AccessibilityService);
  protected readonly router = inject(Router);

  protected readonly today = new Date();
  protected isWorkSubmitted = true;

  protected readonly wizardTotal = 4;
  protected readonly wizardCompleted = signal(this.loadWizardCompleted());

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
