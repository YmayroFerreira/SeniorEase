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
import { TranslateService } from '@ngx-translate/core';
import { AccessibilityService, IconComponent } from '@senior-ease/ui';
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
  imports: [
    CommonModule,
    FontAwesomeModule,
    VoiceReadDirective,
    BreadcrumbComponent,
    IconComponent,
  ],
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
  protected readonly translate = inject(TranslateService);

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
      label: this.translate.instant('FINAL_WORK.STAGE_SUBMITTED_LABEL'),
      date: '15/03/2026',
      description: this.translate.instant('FINAL_WORK.STAGE_SUBMITTED_DESC'),
      icon: this.icons.upload,
      type: 'default',
    },
    {
      id: 'received',
      label: this.translate.instant('FINAL_WORK.STAGE_RECEIVED_LABEL'),
      date: '15/03/2026',
      description: this.translate.instant('FINAL_WORK.STAGE_RECEIVED_DESC'),
      icon: this.icons.check,
      type: 'default',
    },
    {
      id: 'reviewing',
      label: this.translate.instant('FINAL_WORK.STAGE_REVIEWING_LABEL'),
      date: '18/03/2026',
      description: this.translate.instant('FINAL_WORK.STAGE_REVIEWING_DESC'),
      icon: this.icons.review,
      type: 'default',
    },
    {
      id: 'evaluated',
      label: this.translate.instant('FINAL_WORK.STAGE_EVALUATED_LABEL'),
      date: '22/03/2026',
      description: this.translate.instant('FINAL_WORK.STAGE_EVALUATED_DESC'),
      icon: this.icons.checkDouble,
      type: 'default',
    },
    {
      id: 'grade',
      label: this.translate.instant('FINAL_WORK.STAGE_GRADE_LABEL'),
      date: '22/03/2026',
      description: this.translate.instant('FINAL_WORK.STAGE_GRADE_DESC'),
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
