import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  type FontSize,
  type Theme,
} from '../../core/services/accessibility.service';
import { VoiceReadingService } from '../../core/services/voice-reading.service';
import { VoiceReadDirective } from '../../shared/directives/voice-read.directive';

type Animation = 'normal' | 'slow' | 'none';

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
  private readonly accessibilityService = inject(AccessibilityService);
  protected readonly voiceReadingService = inject(VoiceReadingService);

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

  protected readonly selectedFontSize = this.accessibilityService.fontSize;
  protected readonly selectedTheme = this.accessibilityService.theme;
  protected readonly selectedAnimation = signal<Animation>('normal');
  protected readonly speechRate = this.accessibilityService.speechRate;

  protected readonly prefs = signal<AccessibilityPrefs>({
    voiceReading: this.accessibilityService.voiceReading(),
    largerButtons: true,
    simplifiedNav: false,
    silentMode: false,
    increasedSpacing: false,
    dyslexiaFont: this.accessibilityService.dyslexiaFont(),
  });

  protected readonly fontSizeOptions: { value: FontSize; label: string; description: string }[] = [
    { value: 'small', label: 'P', description: 'Compacto' },
    { value: 'medium', label: 'M', description: 'Padrão' },
    { value: 'large', label: 'G', description: 'Grande' },
    { value: 'x-large', label: 'XG', description: 'Maior' },
    { value: 'xx-large', label: 'XXG', description: 'Máximo' },
  ];

  protected readonly fontIconPx: Record<FontSize, number> = {
    small: 10,
    medium: 13,
    large: 17,
    'x-large': 21,
    'xx-large': 25,
  };

  protected readonly themeOptions: { value: Theme; label: string; description: string }[] = [
    { value: 'default', label: 'Padrão', description: 'Azul e branco' },
    { value: 'high-contrast', label: 'Alto Contraste', description: 'Preto e amarelo' },
    { value: 'soft', label: 'Suave', description: 'Tons pastéis' },
  ];

  protected readonly animationOptions: { value: Animation; label: string }[] = [
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
    if (key === 'voiceReading') {
      this.accessibilityService.voiceReading.set(this.prefs()[key]);
      if (this.prefs()[key]) {
        this.voiceReadingService.speakDirect('Leitura em voz alta ativada!');
      } else {
        this.voiceReadingService.stop();
      }
    }
    if (key === 'dyslexiaFont') {
      this.accessibilityService.dyslexiaFont.set(this.prefs()[key]);
    }
  }

  protected updateSpeechRate(rate: number): void {
    this.accessibilityService.speechRate.set(rate);
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
    this.accessibilityService.fontSize.set('medium');
    this.accessibilityService.theme.set('default');
    this.accessibilityService.voiceReading.set(false);
    this.accessibilityService.speechRate.set(0.9);
    this.selectedAnimation.set('normal');
    this.accessibilityService.dyslexiaFont.set(false);
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
