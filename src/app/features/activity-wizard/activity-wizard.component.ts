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
import { AccessibilityService } from '../../core/services/accessibility.service';
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

const ACTIVITIES: Activity[] = [
  {
    id: 'aula',
    title: 'Participar da Aula',
    description: 'Aula de Desenvolvimento Front End — Prof. Carlos Mendes',
    estimatedMinutes: 120,
    steps: [
      {
        title: 'Prepare-se para a aula',
        description:
          'Certifique-se de estar em um lugar tranquilo, com boa iluminação. Tenha água por perto e fones de ouvido, se possível.',
        actionLabel: 'Estou pronto!',
      },
      {
        title: 'Sala de Espera',
        description: 'Verifique sua conexão e entre na aula quando estiver pronto.',
        actionLabel: 'Entrar na aula',
        expandedContent: 'waiting-room',
      },
      {
        title: 'Você saiu da aula',
        description: 'Pode voltar ao vídeo a qualquer momento ou concluir a atividade.',
        actionLabel: 'Concluir atividade',
        expandedContent: 'post-class',
      },
    ],
  },
  {
    id: 'caderno',
    title: 'Revisar Anotações',
    description: 'Acesse seu caderno e revise o que você anotou nas aulas anteriores',
    estimatedMinutes: 15,
    steps: [
      {
        title: 'Abra seu caderno digital',
        description:
          'Clique em "Abrir o Caderno" para ver suas anotações. Quando terminar a leitura, volte aqui e clique em "Já fiz isso".',
        actionLabel: 'Abrir o Caderno',
        actionRoute: '/meu-caderno',
      },
      {
        title: 'Você revisou suas anotações!',
        description:
          'Muito bem! Reler o conteúdo ajuda a fixar na memória. Você pode fazer isso quantas vezes quiser.',
        actionLabel: 'Atividade concluída!',
      },
    ],
  },
  {
    id: 'forum',
    title: 'Participar do Fórum',
    description: 'Leia as mensagens e tire dúvidas com colegas e professores',
    estimatedMinutes: 10,
    steps: [
      {
        title: 'Acesse o fórum da turma',
        description:
          'Clique em "Abrir o Fórum" para ver as mensagens. O fórum é um espaço seguro — não tenha vergonha de perguntar.',
        actionLabel: 'Abrir o Fórum',
        actionRoute: '/forum',
      },
      {
        title: 'Você participou do fórum!',
        description:
          'Ótimo! Participar do fórum ajuda você a tirar dúvidas e a conhecer melhor seus colegas.',
        actionLabel: 'Atividade concluída!',
      },
    ],
  },
  {
    id: 'trabalho',
    title: 'Trabalho Final',
    description: 'Acompanhe o status da sua entrega do trabalho final',
    estimatedMinutes: 5,
    steps: [
      {
        title: 'Verifique o status da entrega',
        description:
          'Clique em "Ver status" para confirmar que seu trabalho foi recebido e ver sua nota.',
        actionLabel: 'Ver status do trabalho',
        actionRoute: '/trabalho-final',
      },
      {
        title: 'Trabalho entregue com sucesso!',
        description:
          'Seu trabalho final foi entregue. Você pode ficar tranquilo — a entrega foi confirmada pelo sistema.',
        actionLabel: 'Entendido!',
      },
    ],
  },
];

@Component({
  selector: 'app-activity-wizard',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, VoiceReadDirective],
  templateUrl: './activity-wizard.component.html',
})
export class ActivityWizardComponent {
  protected readonly router = inject(Router);
  protected readonly accessibility = inject(AccessibilityService);

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
    if (diffMin > 1) return `A aula começa em ${diffMin} minutos`;
    if (diffMin === 1) return 'A aula começa em 1 minuto';
    if (diffMin === 0) return 'A aula está começando agora!';
    const late = Math.abs(diffMin);
    return `Você está ${late} ${late === 1 ? 'minuto' : 'minutos'} atrasado`;
  });

  protected readonly connectionLabel = computed(() => {
    switch (this.connectionStatus()) {
      case 'testing':
        return 'Verificando conexão…';
      case 'ok':
        return `Conexão boa (${this.connectionLatency()}ms)`;
      case 'slow':
        return `Conexão lenta (${this.connectionLatency()}ms)`;
      case 'offline':
        return 'Sem conexão com a internet';
      default:
        return 'Testar minha conexão';
    }
  });

  protected readonly connectionDescription = computed(() => {
    switch (this.connectionStatus()) {
      case 'ok':
        return 'Tudo certo para a aula!';
      case 'slow':
        return 'O vídeo pode travar. Se isso acontecer, feche outros aplicativos.';
      case 'offline':
        return 'Verifique o Wi-Fi ou dados móveis e tente novamente.';
      default:
        return 'Clique para verificar se sua internet está boa';
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

  protected readonly activities = ACTIVITIES;

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
