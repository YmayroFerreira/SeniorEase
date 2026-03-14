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
  faWifi,
} from '@fortawesome/free-solid-svg-icons';
import { AccessibilityService } from '../../core/services/accessibility.service';
import { VoiceInputService } from '../../core/services/voice-input.service';
import { VoiceReadDirective } from '../../shared/directives/voice-read.directive';

@Component({
  selector: 'app-waiting-room',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, VoiceReadDirective],
  templateUrl: './waiting-room.component.html',
})
export class WaitingRoomComponent {
  protected readonly accessibility = inject(AccessibilityService);
  protected readonly router = inject(Router);
  protected readonly voiceInput = inject(VoiceInputService);
  private readonly cdr = inject(ChangeDetectorRef);

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
  };

  connectionStatus: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  statusMessage = 'Testar minha conexão';

  testConnection() {
    this.connectionStatus = 'loading';
    this.statusMessage = 'Verificando...';

    // Simulação de teste (2.5 segundos)
    setTimeout(() => {
      const isOnline = navigator.onLine;
      if (isOnline) {
        this.connectionStatus = 'success';
        this.statusMessage = 'Conexão excelente!';
      } else {
        this.connectionStatus = 'error';
        this.statusMessage = 'Sem internet no momento';
      }
      this.cdr.detectChanges(); // Força a atualização da tela

      // Opcional: Volta ao estado original após 5 segundos
      setTimeout(() => {
        this.connectionStatus = 'idle';
        this.statusMessage = 'Testar minha conexão';
        this.cdr.detectChanges(); // Força a atualização da tela novamente
      }, 5000);
    }, 2500);
  }
}
