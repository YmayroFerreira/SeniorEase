// c:\FIAP\SeniorEase\src\app\features\dashboard\dashboard.component.ts
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
import { BadgeComponent, ButtonComponent, IconComponent } from '@senior-ease/ui';
import { AccessibilityService } from '../../core/services/accessibility.service';
import { VoiceInputService } from '../../core/services/voice-input.service';
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
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  protected readonly accessibility = inject(AccessibilityService);
  protected readonly router = inject(Router);
  protected readonly voiceInput = inject(VoiceInputService);

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
