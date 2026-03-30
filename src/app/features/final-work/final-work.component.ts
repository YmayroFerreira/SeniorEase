import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowLeft,
  faCheckCircle,
  faCheckDouble,
  faTrophy,
  faUpload,
  faUserCheck,
} from '@fortawesome/free-solid-svg-icons';
import { AccessibilityService } from '../../core/services/accessibility.service';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { VoiceReadDirective } from '../../shared/directives/voice-read.directive';

interface TimelineStage {
  id: string;
  label: string;
  date: string;
  description: string;
  icon: IconProp;
  type: 'default' | 'grade';
  grade?: number;
  maxGrade?: number;
}

@Component({
  selector: 'app-final-work',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, VoiceReadDirective, BreadcrumbComponent],
  templateUrl: './final-work.component.html',
  styles: [
    `
      @keyframes slide-up {
        from {
          opacity: 0;
          transform: translateY(1.25rem);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes pop-in {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        60% {
          transform: scale(1.2);
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      @keyframes grow-down {
        from {
          transform: scaleY(0);
          transform-origin: top;
        }
        to {
          transform: scaleY(1);
          transform-origin: top;
        }
      }
      .anim-slide-up {
        animation: slide-up 0.5s ease-out both;
      }
      .anim-pop-in {
        animation: pop-in 0.45s ease-out both;
      }
      .anim-grow-line {
        animation: grow-down 0.4s ease-out both;
      }
    `,
  ],
})
export class FinalWorkComponent {
  protected readonly accessibility = inject(AccessibilityService);
  private readonly location = inject(Location);
  protected readonly router = inject(Router);

  protected readonly fromWizard = !!localStorage.getItem('wizard-session');
  protected goBack(): void {
    this.location.back();
  }

  protected readonly icons = {
    arrowLeft: faArrowLeft,
    upload: faUpload,
    check: faCheckCircle,
    review: faUserCheck,
    checkDouble: faCheckDouble,
    trophy: faTrophy,
  };

  protected readonly stages: TimelineStage[] = [
    {
      id: 'submitted',
      label: 'Entrega realizada',
      date: '15/03/2026',
      description: 'Seu arquivo foi enviado com sucesso para a plataforma.',
      icon: this.icons.upload,
      type: 'default',
    },
    {
      id: 'received',
      label: 'Recebido pela plataforma',
      date: '15/03/2026',
      description: 'A entrega foi confirmada e registrada pelo sistema.',
      icon: this.icons.check,
      type: 'default',
    },
    {
      id: 'reviewing',
      label: 'Em avaliação',
      date: '18/03/2026',
      description: 'O Prof. Dr. Carlos Mendes avaliou seu trabalho.',
      icon: this.icons.review,
      type: 'default',
    },
    {
      id: 'evaluated',
      label: 'Avaliação concluída',
      date: '22/03/2026',
      description: 'A correção foi finalizada e a nota atribuída.',
      icon: this.icons.checkDouble,
      type: 'default',
    },
    {
      id: 'grade',
      label: 'Nota final',
      date: '22/03/2026',
      description: 'Parabéns! Você concluiu o trabalho com excelência.',
      icon: this.icons.trophy,
      type: 'grade',
      grade: 9,
      maxGrade: 9,
    },
  ];

  protected staggerDelay(index: number): string {
    const speed = this.accessibility.animationSpeed();
    if (speed === 'none') return '0ms';
    const ms = speed === 'slow' ? 800 : 350;
    return `${index * ms}ms`;
  }
}
