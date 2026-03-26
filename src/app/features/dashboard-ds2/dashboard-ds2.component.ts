import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import {
  BadgeComponent,
  ButtonComponent,
  DividerComponent,
  IconComponent,
  ListItemComponent,
} from '@senior-ease/ui';
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
    ListItemComponent,
    DividerComponent,
  ],
  templateUrl: './dashboard-ds2.component.html',
})
export class DashboardDs2Component {
  protected readonly accessibility = inject(AccessibilityService);
  protected readonly router = inject(Router);

  protected readonly today = new Date();
  protected isWorkSubmitted = true;

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
