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
import { AccessibilityService } from '../../core/services/accessibility.service';
import { VoiceInputService } from '../../core/services/voice-input.service';
import { VoiceReadDirective } from '../../shared/directives/voice-read.directive';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, VoiceReadDirective],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  protected readonly accessibility = inject(AccessibilityService);
  protected readonly router = inject(Router);
  protected readonly voiceInput = inject(VoiceInputService);

  protected readonly today = new Date();

  protected readonly icons = {
    calendar: faCalendarCheck,
    study: faBookOpen,
    work: faBriefcase,
    chevronRight: faChevronRight,
    check: faCheckCircle,
    clipboard: faClipboard,
    clock: faClock,
  };

  protected readonly urgentActivities = [
    {
      id: 1,
      type: 'study',
      title: 'Aula de Cidades Inteligentes',
      description: 'Hoje você tem aula às 19h',
      time: '19:00',
      actionLabel: 'Entrar na Sala',
    },
    {
      id: 2,
      type: 'work',
      title: 'Registro de Mentoria Pendente',
      description: 'Você não registrou a mentoria de ontem',
      time: null,
      actionLabel: 'Registrar Agora',
    },
  ];

  protected handleAction(activity: any): void {
    if (activity.type === 'work') {
      console.log('Iniciar fluxo de registro de mentoria');
      // Futuro: Navegar para o Workflow Stepper
    } else {
      console.log('Abrir link da aula');
    }
  }
}
