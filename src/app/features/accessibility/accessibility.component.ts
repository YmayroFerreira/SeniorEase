import { Component, inject, NgZone, OnDestroy, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs';

import {
  AccessibilityService,
  IconComponent,
  type AnimationSpeed,
  type FontSize,
  type Theme,
} from '@senior-ease/ui';
import { AccessibilityFirestoreService } from '../../core/services/accessibility-firestore.service';
import { AccessibilityService as CoreAccessibilityService } from '../../core/services/accessibility.service';
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
  imports: [RouterLink, FontAwesomeModule, VoiceReadDirective, TranslatePipe, IconComponent],
  templateUrl: './accessibility.component.html',
})
export class AccessibilityComponent implements OnDestroy {
  private readonly svc = inject(AccessibilityService);
  private readonly coreSvc = inject(CoreAccessibilityService);
  protected readonly voiceReadingService = inject(VoiceReadingService);
  protected readonly translate = inject(TranslateService);
  protected readonly router = inject(Router);
  private readonly accessibilityFirestore = inject(AccessibilityFirestoreService);
  private readonly ngZone = inject(NgZone);
  private _firestoreDebounce: ReturnType<typeof setTimeout> | null = null;

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

  protected readonly activeLang = toSignal(this.translate.onLangChange.pipe(map((e) => e.lang)), {
    initialValue: this.translate.getCurrentLang(),
  });

  protected readonly selectedFontSize = this.svc.fontSize;
  protected readonly selectedTheme = this.svc.theme;
  protected readonly selectedAnimation = this.svc.animationSpeed;
  protected readonly speechRate = this.svc.speechRate;

  protected readonly prefs = signal<AccessibilityPrefs>({
    voiceReading: this.svc.voiceReading(),
    largerButtons: this.coreSvc.largerButtons(),
    simplifiedNav: this.svc.simplifiedNav(),
    silentMode: this.coreSvc.silentMode(),
    increasedSpacing: this.svc.increasedSpacing(),
    dyslexiaFont: this.svc.dyslexiaFont(),
  });

  protected readonly fontSizeOptions: { value: FontSize; label: string; description: string }[] = [
    {
      value: 'small',
      label: 'ACCESSIBILITY.FONT_SIZE.SMALL_LABEL',
      description: 'ACCESSIBILITY.FONT_SIZE.SMALL_DESC',
    },
    {
      value: 'medium',
      label: 'ACCESSIBILITY.FONT_SIZE.MEDIUM_LABEL',
      description: 'ACCESSIBILITY.FONT_SIZE.MEDIUM_DESC',
    },
    {
      value: 'large',
      label: 'ACCESSIBILITY.FONT_SIZE.LARGE_LABEL',
      description: 'ACCESSIBILITY.FONT_SIZE.LARGE_DESC',
    },
    {
      value: 'x-large',
      label: 'ACCESSIBILITY.FONT_SIZE.X_LARGE_LABEL',
      description: 'ACCESSIBILITY.FONT_SIZE.X_LARGE_DESC',
    },
    {
      value: 'xx-large',
      label: 'ACCESSIBILITY.FONT_SIZE.XX_LARGE_LABEL',
      description: 'ACCESSIBILITY.FONT_SIZE.XX_LARGE_DESC',
    },
  ];

  protected readonly fontIconRem: Record<FontSize, number> = {
    small: 0.625,
    medium: 0.8125,
    large: 1.0625,
    'x-large': 1.3125,
    'xx-large': 1.5625,
  };

  protected readonly themeOptions: { value: Theme; label: string; description: string }[] = [
    {
      value: 'default',
      label: 'ACCESSIBILITY.THEME.DEFAULT_LABEL',
      description: 'ACCESSIBILITY.THEME.DEFAULT_DESC',
    },
    {
      value: 'high-contrast',
      label: 'ACCESSIBILITY.THEME.HIGH_CONTRAST_LABEL',
      description: 'ACCESSIBILITY.THEME.HIGH_CONTRAST_DESC',
    },
    {
      value: 'soft',
      label: 'ACCESSIBILITY.THEME.SOFT_LABEL',
      description: 'ACCESSIBILITY.THEME.SOFT_DESC',
    },
  ];

  protected readonly animationOptions: { value: AnimationSpeed; label: string }[] = [
    { value: 'normal', label: 'ACCESSIBILITY.ANIMATION.NORMAL' },
    { value: 'slow', label: 'ACCESSIBILITY.ANIMATION.SLOW' },
    { value: 'none', label: 'ACCESSIBILITY.ANIMATION.NONE' },
  ];

  protected readonly languageOptions: { value: string; label: string }[] = [
    { value: 'pt', label: 'ACCESSIBILITY.LANGUAGE.PT' },
    { value: 'en', label: 'ACCESSIBILITY.LANGUAGE.EN' },
  ];

  protected readonly toggleItems: {
    key: keyof AccessibilityPrefs;
    label: string;
    description: string;
  }[] = [
    {
      key: 'voiceReading',
      label: 'ACCESSIBILITY.FEATURES.VOICE_READING_LABEL',
      description: 'ACCESSIBILITY.FEATURES.VOICE_READING_DESC',
    },
    {
      key: 'largerButtons',
      label: 'ACCESSIBILITY.FEATURES.LARGER_BUTTONS_LABEL',
      description: 'ACCESSIBILITY.FEATURES.LARGER_BUTTONS_DESC',
    },
    {
      key: 'simplifiedNav',
      label: 'ACCESSIBILITY.FEATURES.SIMPLIFIED_NAV_LABEL',
      description: 'ACCESSIBILITY.FEATURES.SIMPLIFIED_NAV_DESC',
    },
    {
      key: 'silentMode',
      label: 'ACCESSIBILITY.FEATURES.SILENT_MODE_LABEL',
      description: 'ACCESSIBILITY.FEATURES.SILENT_MODE_DESC',
    },
    {
      key: 'increasedSpacing',
      label: 'ACCESSIBILITY.FEATURES.INCREASED_SPACING_LABEL',
      description: 'ACCESSIBILITY.FEATURES.INCREASED_SPACING_DESC',
    },
    {
      key: 'dyslexiaFont',
      label: 'ACCESSIBILITY.FEATURES.DYSLEXIA_FONT_LABEL',
      description: 'ACCESSIBILITY.FEATURES.DYSLEXIA_FONT_DESC',
    },
  ];

  protected togglePref(key: keyof AccessibilityPrefs): void {
    this.prefs.update((p) => ({ ...p, [key]: !p[key] }));
    const val = this.prefs()[key] as boolean;
    if (key === 'voiceReading') {
      this.svc.voiceReading.set(val);
      this.coreSvc.voiceReading.set(val);
      if (val) {
        this.voiceReadingService.speakDirect(
          this.translate.instant('ACCESSIBILITY.SPEECH.ACTIVATED_MESSAGE'),
        );
      } else {
        this.voiceReadingService.stop();
      }
    }
    if (key === 'dyslexiaFont') this.svc.dyslexiaFont.set(val);
    if (key === 'increasedSpacing') this.svc.increasedSpacing.set(val);
    if (key === 'simplifiedNav') this.svc.simplifiedNav.set(val);
    if (key === 'largerButtons') this.coreSvc.largerButtons.set(val);
    if (key === 'silentMode') {
      this.coreSvc.silentMode.set(val);
      if (val) this.voiceReadingService.stop();
    }
    this.scheduleFirestoreSave();
  }

  protected updateSpeechRate(rate: number): void {
    this.svc.speechRate.set(rate);
    this.scheduleFirestoreSave();
  }

  protected testSpeech(): void {
    if (this.voiceReadingService.speaking()) {
      this.voiceReadingService.stop();
    } else {
      this.voiceReadingService.speakDirect(
        this.translate.instant('ACCESSIBILITY.SPEECH.TEST_MESSAGE'),
      );
    }
  }

  protected setFontSize(value: FontSize): void {
    this.selectedFontSize.set(value);
    this.scheduleFirestoreSave();
  }

  protected setTheme(value: Theme): void {
    this.selectedTheme.set(value);
    this.scheduleFirestoreSave();
  }

  protected setAnimation(value: AnimationSpeed): void {
    this.selectedAnimation.set(value);
    this.scheduleFirestoreSave();
  }

  protected changeLang(lang: string): void {
    this.translate.use(lang);
  }

  protected get speedLabel(): string {
    const rate = this.speechRate();
    if (rate <= 0.6) return 'ACCESSIBILITY.SPEECH.VERY_SLOW';
    if (rate <= 0.8) return 'ACCESSIBILITY.SPEECH.SLOW';
    if (rate <= 1.0) return 'ACCESSIBILITY.SPEECH.NORMAL';
    if (rate <= 1.2) return 'ACCESSIBILITY.SPEECH.FAST';
    return 'ACCESSIBILITY.SPEECH.VERY_FAST';
  }

  private buildPrefsSnapshot() {
    return {
      fontSize: this.svc.fontSize(),
      theme: this.svc.theme(),
      voiceReading: this.svc.voiceReading(),
      speechRate: this.svc.speechRate(),
      dyslexiaFont: this.svc.dyslexiaFont(),
      animationSpeed: this.svc.animationSpeed(),
      extraConfirmations: this.svc.extraConfirmations(),
      increasedSpacing: this.svc.increasedSpacing(),
      simplifiedNav: this.svc.simplifiedNav(),
      largerButtons: this.coreSvc.largerButtons(),
      silentMode: this.coreSvc.silentMode(),
    };
  }

  private doFirestoreSave(): void {
    this.accessibilityFirestore
      .save(this.buildPrefsSnapshot())
      .catch((err) => console.error('[AccessibilityFirestore] save failed:', err));
  }

  private scheduleFirestoreSave(): void {
    if (this._firestoreDebounce) clearTimeout(this._firestoreDebounce);
    this._firestoreDebounce = this.ngZone.runOutsideAngular(() =>
      setTimeout(() => {
        this.ngZone.run(() => {
          this.doFirestoreSave();
          this._firestoreDebounce = null;
        });
      }, 2000),
    );
  }

  ngOnDestroy(): void {
    if (this._firestoreDebounce) {
      clearTimeout(this._firestoreDebounce);
    }
    this.doFirestoreSave();
  }

  protected resetPreferences(): void {
    this.svc.fontSize.set('medium');
    this.svc.theme.set('default');
    this.svc.voiceReading.set(false);
    this.coreSvc.voiceReading.set(false);
    this.svc.speechRate.set(0.9);
    this.svc.animationSpeed.set('normal');
    this.svc.dyslexiaFont.set(false);
    this.svc.increasedSpacing.set(false);
    this.svc.simplifiedNav.set(false);
    this.coreSvc.largerButtons.set(false);
    this.coreSvc.silentMode.set(false);
    this.prefs.set({
      voiceReading: false,
      largerButtons: false,
      simplifiedNav: false,
      silentMode: false,
      increasedSpacing: false,
      dyslexiaFont: false,
    });
    this.scheduleFirestoreSave();
  }
}
