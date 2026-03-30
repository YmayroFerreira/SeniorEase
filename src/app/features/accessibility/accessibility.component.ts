import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faBars,
  faExpand,
  faFont,
  faPause,
  faPlay,
  faTextHeight,
  faTextWidth,
  faVolumeMute,
  faVolumeUp,
  faWheelchair,
} from '@fortawesome/free-solid-svg-icons';
import {
  AccessibilityService,
  type AnimationSpeed,
  type FontSize,
  type Theme,
} from '../../core/services/accessibility.service';
import { VoiceReadingService } from '../../core/services/voice-reading.service';
import { VoiceReadDirective } from '../../shared/directives/voice-read.directive';

interface AccessibilityPrefs {
  voiceReading: boolean;
  largerButtons: boolean;
  simplifiedNav: boolean;
  silentMode: boolean;
  increasedSpacing: boolean;
  dyslexiaFont: boolean;
}

@Component({
  selector: 'app-accessibility',
  imports: [RouterLink, FontAwesomeModule, VoiceReadDirective],
  templateUrl: './accessibility.component.html',
})
export class AccessibilityComponent {
  private readonly svc = inject(AccessibilityService);
  protected readonly voiceReadingService = inject(VoiceReadingService);
  protected readonly router = inject(Router);

  protected readonly icons = {
    wheelchair: faWheelchair,
    textHeight: faTextHeight,
    arrowLeft: faArrowLeft,
    voiceReading: faVolumeUp,
    largerButtons: faExpand,
    simplifiedNav: faBars,
    silentMode: faVolumeMute,
    increasedSpacing: faTextWidth,
    dyslexiaFont: faFont,
    play: faPlay,
    pause: faPause,
  };

  protected readonly selectedFontSize = this.svc.fontSize;
  protected readonly selectedTheme = this.svc.theme;
  protected readonly selectedAnimation = this.svc.animationSpeed;
  protected readonly speechRate = this.svc.speechRate;

  protected readonly prefs = signal<AccessibilityPrefs>({
    voiceReading: this.svc.voiceReading(),
    largerButtons: true,
    simplifiedNav: this.svc.simplifiedNav(),
    silentMode: false,
    increasedSpacing: this.svc.increasedSpacing(),
    dyslexiaFont: this.svc.dyslexiaFont(),
  });

  protected readonly fontSizeOptions: { value: FontSize; label: string; description: string }[] = [
    { value: 'small', label: 'P', description: 'Compacto' },
    { value: 'medium', label: 'M', description: 'Padrão' },
    { value: 'large', label: 'G', description: 'Grande' },
    { value: 'x-large', label: 'XG', description: 'Maior' },
    { value: 'xx-large', label: 'XXG', description: 'Máximo' },
  ];

  protected readonly fontIconRem: Record<FontSize, number> = {
    small: 0.625,
    medium: 0.8125,
    large: 1.0625,
    'x-large': 1.3125,
    'xx-large': 1.5625,
  };

  protected readonly themeOptions: { value: Theme; label: string; description: string }[] = [
    { value: 'default', label: 'Padrão', description: 'Azul e branco' },
    { value: 'high-contrast', label: 'Alto Contraste', description: 'Preto e amarelo' },
    { value: 'soft', label: 'Suave', description: 'Tons pastéis' },
  ];

  protected readonly animationOptions: { value: AnimationSpeed; label: string }[] = [
    { value: 'normal', label: 'Normal' },
    { value: 'slow', label: 'Lenta' },
    { value: 'none', label: 'Sem animações' },
  ];

  protected readonly toggleItems: {
    key: keyof AccessibilityPrefs;
    label: string;
    description: string;
  }[] = [
    { key: 'voiceReading', label: 'Leitura em voz alta', description: 'Narrar textos ao tocar' },
    { key: 'largerButtons', label: 'Botões maiores', description: 'Aumentar área de toque' },
    { key: 'simplifiedNav', label: 'Navegação simplificada', description: 'Menos opções de menu' },
    { key: 'silentMode', label: 'Modo silencioso', description: 'Desativar sons do sistema' },
    {
      key: 'increasedSpacing',
      label: 'Espaçamento aumentado',
      description: 'Mais espaço entre elementos',
    },
    {
      key: 'dyslexiaFont',
      label: 'Fonte para dislexia',
      description: 'Facilita a leitura para disléxicos',
    },
  ];

  protected togglePref(key: keyof AccessibilityPrefs): void {
    this.prefs.update((p) => ({ ...p, [key]: !p[key] }));
    const val = this.prefs()[key] as boolean;
    if (key === 'voiceReading') {
      this.svc.voiceReading.set(val);
      if (val) {
        this.voiceReadingService.speakDirect('Leitura em voz alta ativada!');
      } else {
        this.voiceReadingService.stop();
      }
    }
    if (key === 'dyslexiaFont') this.svc.dyslexiaFont.set(val);
    if (key === 'increasedSpacing') this.svc.increasedSpacing.set(val);
    if (key === 'simplifiedNav') this.svc.simplifiedNav.set(val);
  }

  protected updateSpeechRate(rate: number): void {
    this.svc.speechRate.set(rate);
  }

  protected testSpeech(): void {
    if (this.voiceReadingService.speaking()) {
      this.voiceReadingService.stop();
    } else {
      this.voiceReadingService.speakDirect(
        'Olá! Esta é uma demonstração da leitura em voz alta do SeniorEase.',
      );
    }
  }

  protected get speedLabel(): string {
    const rate = this.speechRate();
    if (rate <= 0.6) return 'Muito lenta';
    if (rate <= 0.8) return 'Lenta';
    if (rate <= 1.0) return 'Normal';
    if (rate <= 1.2) return 'Rápida';
    return 'Muito rápida';
  }

  protected resetPreferences(): void {
    this.svc.fontSize.set('medium');
    this.svc.theme.set('default');
    this.svc.voiceReading.set(false);
    this.svc.speechRate.set(0.9);
    this.svc.animationSpeed.set('normal');
    this.svc.dyslexiaFont.set(false);
    this.svc.increasedSpacing.set(false);
    this.svc.simplifiedNav.set(false);
    this.prefs.set({
      voiceReading: false,
      largerButtons: true,
      simplifiedNav: false,
      silentMode: false,
      increasedSpacing: false,
      dyslexiaFont: false,
    });
  }
}
