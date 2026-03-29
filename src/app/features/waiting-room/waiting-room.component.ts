// c:\FIAP\SeniorEase\src\app\features\dashboard\dashboard.component.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faBookOpen,
  faBriefcase,
  faCalendarCheck,
  faCheckCircle,
  faChevronRight,
  faClipboard,
  faClock,
  faExclamationTriangle,
  faLightbulb,
  faSpinner,
  faVideo,
  faWifi,
} from '@fortawesome/free-solid-svg-icons';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AccessibilityService } from '../../core/services/accessibility.service';
import { VoiceInputService } from '../../core/services/voice-input.service';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { VoiceReadDirective } from '../../shared/directives/voice-read.directive';

@Component({
  selector: 'app-waiting-room',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    VoiceReadDirective,
    BreadcrumbComponent,
    TranslatePipe,
  ],
  templateUrl: './waiting-room.component.html',
})
export class WaitingRoomComponent {
  protected readonly accessibility = inject(AccessibilityService);
  protected readonly router = inject(Router);
  protected readonly voiceInput = inject(VoiceInputService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly translate = inject(TranslateService);

  protected readonly today = new Date();

  protected readonly icons = {
    calendar: faCalendarCheck,
    study: faBookOpen,
    work: faBriefcase,
    chevronRight: faChevronRight,
    check: faCheckCircle,
    clipboard: faClipboard,
    clock: faClock,
    lightbulb: faLightbulb,
    arrowLeft: faArrowLeft,
    spinner: faSpinner,
    wifi: faWifi,
    error: faExclamationTriangle,
    video: faVideo,
  };

  connectionStatus: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  statusMessage = '';

  constructor() {
    this.statusMessage = this.translate.instant('WAITING_ROOM.STATUS_IDLE');
  }

  testConnection() {
    this.connectionStatus = 'loading';
    this.statusMessage = this.translate.instant('WAITING_ROOM.STATUS_LOADING');

    setTimeout(() => {
      const isOnline = navigator.onLine;
      if (isOnline) {
        this.connectionStatus = 'success';
        this.statusMessage = this.translate.instant('WAITING_ROOM.STATUS_SUCCESS');
      } else {
        this.connectionStatus = 'error';
        this.statusMessage = this.translate.instant('WAITING_ROOM.STATUS_ERROR');
      }
      this.cdr.detectChanges();

      setTimeout(() => {
        this.connectionStatus = 'idle';
        this.statusMessage = this.translate.instant('WAITING_ROOM.STATUS_IDLE');
        this.cdr.detectChanges();
      }, 5000);
    }, 2500);
  }
}
