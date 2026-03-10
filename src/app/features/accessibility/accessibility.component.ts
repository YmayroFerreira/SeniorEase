import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faBars,
  faExpand,
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

type Animation = 'normal' | 'slow' | 'none';

interface AccessibilityPrefs {
  voiceReading: boolean;
  largerButtons: boolean;
  simplifiedNav: boolean;
  silentMode: boolean;
  increasedSpacing: boolean;
}

@Component({
  selector: 'app-accessibility',
  imports: [RouterLink, FontAwesomeModule],
  templateUrl: './accessibility.component.html',
})
export class AccessibilityComponent {
  private readonly accessibilityService = inject(AccessibilityService);

  protected readonly icons = {
    wheelchair: faWheelchair,
    textHeight: faTextHeight,
    arrowLeft: faArrowLeft,
    voiceReading: faVolumeUp,
    largerButtons: faExpand,
    simplifiedNav: faBars,
    silentMode: faVolumeMute,
    increasedSpacing: faTextWidth,
  };

  protected readonly selectedFontSize = this.accessibilityService.fontSize;
  protected readonly selectedTheme = this.accessibilityService.theme;
  protected readonly selectedAnimation = signal<Animation>('normal');

  protected readonly prefs = signal<AccessibilityPrefs>({
    voiceReading: false,
    largerButtons: true,
    simplifiedNav: false,
    silentMode: false,
    increasedSpacing: false,
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
  ];

  protected togglePref(key: keyof AccessibilityPrefs): void {
    this.prefs.update((p) => ({ ...p, [key]: !p[key] }));
  }

  protected resetPreferences(): void {
    this.accessibilityService.fontSize.set('medium');
    this.accessibilityService.theme.set('default');
    this.selectedAnimation.set('normal');
    this.prefs.set({
      voiceReading: false,
      largerButtons: true,
      simplifiedNav: false,
      silentMode: false,
      increasedSpacing: false,
    });
  }
}
