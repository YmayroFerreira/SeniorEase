import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faBookOpen,
  faCheckCircle,
  faChevronDown,
  faChevronRight,
  faChevronUp,
  faCircle,
  faClock,
  faComments,
  faExclamationTriangle,
  faExternalLinkAlt,
  faHeadset,
  faPaperPlane,
  faRotateLeft,
  faSpinner,
  faStar,
  faVideo,
  faWifi,
} from '@fortawesome/free-solid-svg-icons';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AccessibilityService, IconComponent } from '@senior-ease/ui';
import { VoiceReadDirective } from '../../shared/directives/voice-read.directive';

export type ConnectionStatus = 'idle' | 'testing' | 'ok' | 'slow' | 'offline';

export interface ActivityStep {
  title: string;
  description: string;
  actionLabel: string;
  actionRoute?: string;
  expandedContent?: 'waiting-room' | 'post-class';
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  steps: ActivityStep[];
}

const COMPLETED_KEY = 'wizard-completed-activities';
const SESSION_KEY = 'wizard-session';

@Component({
  selector: 'app-activity-wizard',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, VoiceReadDirective, TranslatePipe, IconComponent],
  templateUrl: './activity-wizard.component.html',
})
export class ActivityWizardComponent {
  protected readonly router = inject(Router);
  protected readonly accessibility = inject(AccessibilityService);
  private readonly translate = inject(TranslateService);

  protected readonly icons = {
    arrowLeft: faArrowLeft,
    arrowRight: faArrowRight,
    checkCircle: faCheckCircle,
    circle: faCircle,
    chevronRight: faChevronRight,
    chevronDown: faChevronDown,
    chevronUp: faChevronUp,
    externalLink: faExternalLinkAlt,
    video: faVideo,
    book: faBookOpen,
    comments: faComments,
    send: faPaperPlane,
    star: faStar,
    clock: faClock,
    headset: faHeadset,
    wifi: faWifi,
    spinner: faSpinner,
    warning: faExclamationTriangle,
    rotateLeft: faRotateLeft,
  };

  protected readonly activities: Activity[] = [
    {
      id: 'aula',
      title: this.translate.instant('ACTIVITY.ATTEND_CLASS'),
      description: this.translate.instant('ACTIVITY.ATTEND_CLASS_DESC'),
      estimatedMinutes: 120,
      steps: [
        {
          title: this.translate.instant('ACTIVITY.PREPARE_CLASS'),
          description: this.translate.instant('ACTIVITY.PREPARE_CLASS_DESC'),
          actionLabel: this.translate.instant('ACTIVITY.IM_READY'),
        },
        {
          title: this.translate.instant('ACTIVITY.WAITING_ROOM'),
          description: this.translate.instant('ACTIVITY.WAITING_ROOM_DESC'),
          actionLabel: this.translate.instant('ACTIVITY.ENTER_CLASS'),
          expandedContent: 'waiting-room',
        },
        {
          title: this.translate.instant('ACTIVITY.LEFT_CLASS'),
          description: this.translate.instant('ACTIVITY.LEFT_CLASS_DESC'),
          actionLabel: this.translate.instant('ACTIVITY.COMPLETE_ACTIVITY'),
          expandedContent: 'post-class',
        },
      ],
    },
    {
      id: 'caderno',
      title: this.translate.instant('ACTIVITY.REVIEW_NOTES'),
      description: this.translate.instant('ACTIVITY.REVIEW_NOTES_DESC'),
      estimatedMinutes: 15,
      steps: [
        {
          title: this.translate.instant('ACTIVITY.OPEN_NOTEBOOK'),
          description: this.translate.instant('ACTIVITY.OPEN_NOTEBOOK_DESC'),
          actionLabel: this.translate.instant('ACTIVITY.OPEN_NOTEBOOK_BTN'),
          actionRoute: '/meu-caderno',
        },
        {
          title: this.translate.instant('ACTIVITY.NOTES_REVIEWED'),
          description: this.translate.instant('ACTIVITY.NOTES_REVIEWED_DESC'),
          actionLabel: this.translate.instant('ACTIVITY.ACTIVITY_COMPLETED_BTN'),
        },
      ],
    },
    {
      id: 'forum',
      title: this.translate.instant('ACTIVITY.JOIN_FORUM'),
      description: this.translate.instant('ACTIVITY.JOIN_FORUM_DESC'),
      estimatedMinutes: 10,
      steps: [
        {
          title: this.translate.instant('ACTIVITY.OPEN_FORUM'),
          description: this.translate.instant('ACTIVITY.OPEN_FORUM_DESC'),
          actionLabel: this.translate.instant('ACTIVITY.OPEN_FORUM_BTN'),
          actionRoute: '/forum',
        },
        {
          title: this.translate.instant('ACTIVITY.FORUM_JOINED'),
          description: this.translate.instant('ACTIVITY.FORUM_JOINED_DESC'),
          actionLabel: this.translate.instant('ACTIVITY.ACTIVITY_COMPLETED_BTN'),
        },
      ],
    },
    {
      id: 'trabalho',
      title: this.translate.instant('ACTIVITY.FINAL_WORK'),
      description: this.translate.instant('ACTIVITY.FINAL_WORK_DESC'),
      estimatedMinutes: 5,
      steps: [
        {
          title: this.translate.instant('ACTIVITY.CHECK_DELIVERY'),
          description: this.translate.instant('ACTIVITY.CHECK_DELIVERY_DESC'),
          actionLabel: this.translate.instant('ACTIVITY.SEE_STATUS_BTN'),
          actionRoute: '/trabalho-final',
        },
        {
          title: this.translate.instant('ACTIVITY.WORK_DELIVERED'),
          description: this.translate.instant('ACTIVITY.WORK_DELIVERED_DESC'),
          actionLabel: this.translate.instant('ACTIVITY.UNDERSTOOD'),
        },
      ],
    },
  ];

  private readonly classHour = 19;
  private readonly classMinute = 0;

  protected readonly connectionStatus = signal<ConnectionStatus>('idle');
  protected readonly connectionLatency = signal<number | null>(null);
  protected readonly helpExpanded = signal<boolean>(false);

  protected readonly punctualityStatus = computed<'ok' | 'late' | 'soon'>(() => {
    const now = new Date();
    const classStart = new Date();
    classStart.setHours(this.classHour, this.classMinute, 0, 0);
    const diffMin = Math.round((classStart.getTime() - now.getTime()) / 60000);
    if (diffMin > 0) return 'soon';
    if (diffMin >= -5) return 'ok';
    return 'late';
  });

  protected readonly punctualityMessage = computed(() => {
    const now = new Date();
    const classStart = new Date();
    classStart.setHours(this.classHour, this.classMinute, 0, 0);
    const diffMin = Math.round((classStart.getTime() - now.getTime()) / 60000);
    if (diffMin > 1)
      return this.translate.instant('ACTIVITY.PUNCTUALITY.STARTS_IN_MANY', { min: diffMin });
    if (diffMin === 1) return this.translate.instant('ACTIVITY.PUNCTUALITY.STARTS_IN_ONE');
    if (diffMin === 0) return this.translate.instant('ACTIVITY.PUNCTUALITY.STARTING_NOW');
    const late = Math.abs(diffMin);
    if (late === 1) return this.translate.instant('ACTIVITY.PUNCTUALITY.LATE_ONE');
    return this.translate.instant('ACTIVITY.PUNCTUALITY.LATE_MANY', { min: late });
  });

  protected readonly connectionLabel = computed(() => {
    switch (this.connectionStatus()) {
      case 'testing':
        return this.translate.instant('ACTIVITY.CONNECTION.TESTING');
      case 'ok':
        return this.translate.instant('ACTIVITY.CONNECTION.OK', { ms: this.connectionLatency() });
      case 'slow':
        return this.translate.instant('ACTIVITY.CONNECTION.SLOW', { ms: this.connectionLatency() });
      case 'offline':
        return this.translate.instant('ACTIVITY.CONNECTION.OFFLINE');
      default:
        return this.translate.instant('ACTIVITY.CONNECTION.IDLE');
    }
  });

  protected readonly connectionDescription = computed(() => {
    switch (this.connectionStatus()) {
      case 'ok':
        return this.translate.instant('ACTIVITY.CONNECTION.DESC_OK');
      case 'slow':
        return this.translate.instant('ACTIVITY.CONNECTION.DESC_SLOW');
      case 'offline':
        return this.translate.instant('ACTIVITY.CONNECTION.DESC_OFFLINE');
      default:
        return this.translate.instant('ACTIVITY.CONNECTION.DESC_IDLE');
    }
  });

  async testConnection(): Promise<void> {
    this.connectionStatus.set('testing');
    this.connectionLatency.set(null);
    const start = Date.now();
    try {
      await fetch(`/favicon.ico?t=${start}`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
      });
      const ms = Date.now() - start;
      this.connectionLatency.set(ms);
      this.connectionStatus.set(ms < 500 ? 'ok' : 'slow');
    } catch {
      this.connectionStatus.set('offline');
    }
  }

  protected returnToClass(): void {
    this.router.navigate(['/aula']);
  }

  protected enterClass(): void {
    const nextIndex = this.activeStepIndex() + 1;
    this.activeStepIndex.set(nextIndex);
    this.saveSession(this.activeActivityId()!, nextIndex);
    this.router.navigate(['/aula']);
  }

  protected readonly completedIds = signal<Set<string>>(this.loadCompleted());
  protected readonly activeActivityId = signal<string | null>(this.loadSession().activityId);
  protected readonly activeStepIndex = signal<number>(this.loadSession().stepIndex);
  protected readonly showCelebration = signal<boolean>(false);

  protected readonly activeActivity = computed(() =>
    this.activities.find((a) => a.id === this.activeActivityId()),
  );

  protected readonly totalCompleted = computed(() => this.completedIds().size);
  protected readonly allDone = computed(() => this.completedIds().size === this.activities.length);

  protected isCompleted(id: string): boolean {
    return this.completedIds().has(id);
  }

  protected openActivity(id: string): void {
    if (this.isCompleted(id)) return;
    this.activeActivityId.set(id);
    this.activeStepIndex.set(0);
    this.showCelebration.set(false);
    this.saveSession(id, 0);
  }

  protected closeActivity(): void {
    this.activeActivityId.set(null);
    this.activeStepIndex.set(0);
    this.clearSession();
  }

  protected get currentStep(): ActivityStep | null {
    const activity = this.activeActivity();
    if (!activity) return null;
    return activity.steps[this.activeStepIndex()] ?? null;
  }

  protected get isLastStep(): boolean {
    const activity = this.activeActivity();
    if (!activity) return false;
    return this.activeStepIndex() === activity.steps.length - 1;
  }

  protected navigateToRoute(): void {
    const step = this.currentStep;
    if (!step?.actionRoute) return;
    this.router.navigate([step.actionRoute]);
  }

  protected advanceStep(): void {
    if (this.isLastStep) {
      this.completeActivity();
    } else {
      const nextIndex = this.activeStepIndex() + 1;
      this.activeStepIndex.set(nextIndex);
      this.saveSession(this.activeActivityId()!, nextIndex);
    }
  }

  protected goToPreviousStep(): void {
    if (this.activeStepIndex() > 0) {
      const prevIndex = this.activeStepIndex() - 1;
      this.activeStepIndex.set(prevIndex);
      this.saveSession(this.activeActivityId()!, prevIndex);
    }
  }

  private completeActivity(): void {
    const id = this.activeActivityId();
    if (!id) return;
    const updated = new Set(this.completedIds());
    updated.add(id);
    this.completedIds.set(updated);
    this.saveCompleted(updated);
    this.activeActivityId.set(null);
    this.activeStepIndex.set(0);
    this.clearSession();
    this.showCelebration.set(true);
    setTimeout(() => this.showCelebration.set(false), 4000);
  }

  protected resetProgress(): void {
    this.completedIds.set(new Set());
    localStorage.removeItem(COMPLETED_KEY);
    this.clearSession();
    this.activeActivityId.set(null);
    this.activeStepIndex.set(0);
  }

  private loadCompleted(): Set<string> {
    try {
      const raw = localStorage.getItem(COMPLETED_KEY);
      if (!raw) return new Set();
      return new Set(JSON.parse(raw) as string[]);
    } catch {
      return new Set();
    }
  }

  private saveCompleted(ids: Set<string>): void {
    localStorage.setItem(COMPLETED_KEY, JSON.stringify([...ids]));
  }

  private loadSession(): { activityId: string | null; stepIndex: number } {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return { activityId: null, stepIndex: 0 };
      return JSON.parse(raw);
    } catch {
      return { activityId: null, stepIndex: 0 };
    }
  }

  private saveSession(activityId: string, stepIndex: number): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ activityId, stepIndex }));
  }

  private clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
  }
}
