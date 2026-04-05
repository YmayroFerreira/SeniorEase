import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';

export type FontSize = 'small' | 'medium' | 'large' | 'x-large' | 'xx-large';
export type Theme = 'default' | 'high-contrast' | 'soft';
export type AnimationSpeed = 'normal' | 'slow' | 'none';

const FONT_CLASS_MAP: Record<FontSize, string> = {
  small: 'font-small',
  medium: '',
  large: 'font-large',
  'x-large': 'font-x-large',
  'xx-large': 'font-xx-large',
};

const THEME_CLASS_MAP: Record<Theme, string> = {
  default: '',
  'high-contrast': 'theme-high-contrast',
  soft: 'theme-soft',
};

const VALID_FONTS: FontSize[] = ['small', 'medium', 'large', 'x-large', 'xx-large'];
const VALID_THEMES: Theme[] = ['default', 'high-contrast', 'soft'];

const FONT_KEY = 'accessibility-font-size';
const THEME_KEY = 'accessibility-theme';
const VOICE_KEY = 'accessibility-voice-reading';
const SPEECH_RATE_KEY = 'accessibility-speech-rate';
const DYSLEXIA_KEY = 'accessibility-dyslexia-font';
const ANIMATION_KEY = 'accessibility-animation-speed';
const EXTRA_CONFIRMATIONS_KEY = 'profile-extra-confirmations';
const SPACING_KEY = 'accessibility-increased-spacing';
const SIMPLIFIED_NAV_KEY = 'profile-simplified-nav';
const LARGER_BUTTONS_KEY = 'accessibility-larger-buttons';
const SILENT_MODE_KEY = 'accessibility-silent-mode';

const VALID_ANIMATIONS: AnimationSpeed[] = ['normal', 'slow', 'none'];

@Injectable({ providedIn: 'root' })
export class AccessibilityService {
  private readonly document = inject(DOCUMENT);

  readonly fontSize = signal<FontSize>(this.loadFont());
  readonly theme = signal<Theme>(this.loadTheme());
  readonly voiceReading = signal<boolean>(this.loadVoiceReading());
  readonly speechRate = signal<number>(this.loadSpeechRate());
  readonly dyslexiaFont = signal<boolean>(this.loadDyslexiaFont());
  readonly animationSpeed = signal<AnimationSpeed>(this.loadAnimationSpeed());
  readonly extraConfirmations = signal<boolean>(
    localStorage.getItem(EXTRA_CONFIRMATIONS_KEY) === 'true',
  );
  readonly increasedSpacing = signal<boolean>(localStorage.getItem(SPACING_KEY) === 'true');
  readonly simplifiedNav = signal<boolean>(localStorage.getItem(SIMPLIFIED_NAV_KEY) === 'true');
  readonly largerButtons = signal<boolean>(localStorage.getItem(LARGER_BUTTONS_KEY) === 'true');
  readonly silentMode = signal<boolean>(localStorage.getItem(SILENT_MODE_KEY) === 'true');

  private readonly _fontEffect = effect(() => {
    const size = this.fontSize();
    const classList = this.document.documentElement.classList;
    classList.remove('font-small', 'font-large', 'font-x-large', 'font-xx-large');
    const cls = FONT_CLASS_MAP[size];
    if (cls) classList.add(cls);
    localStorage.setItem(FONT_KEY, size);
  });

  private readonly _themeEffect = effect(() => {
    const t = this.theme();
    const classList = this.document.documentElement.classList;
    classList.remove('theme-high-contrast', 'theme-soft');
    const cls = THEME_CLASS_MAP[t];
    if (cls) classList.add(cls);
    localStorage.setItem(THEME_KEY, t);
  });

  private readonly _voiceEffect = effect(() => {
    localStorage.setItem(VOICE_KEY, String(this.voiceReading()));
  });

  private readonly _speechRateEffect = effect(() => {
    localStorage.setItem(SPEECH_RATE_KEY, String(this.speechRate()));
  });

  private readonly _dyslexiaEffect = effect(() => {
    const enabled = this.dyslexiaFont();
    const classList = this.document.documentElement.classList;
    if (enabled) {
      classList.add('dyslexia-font');
    } else {
      classList.remove('dyslexia-font');
    }
    localStorage.setItem(DYSLEXIA_KEY, String(enabled));
  });

  private readonly _extraConfirmationsEffect = effect(() => {
    localStorage.setItem(EXTRA_CONFIRMATIONS_KEY, String(this.extraConfirmations()));
  });

  private readonly _simplifiedNavEffect = effect(() => {
    localStorage.setItem(SIMPLIFIED_NAV_KEY, String(this.simplifiedNav()));
  });

  private readonly _largerButtonsEffect = effect(() => {
    const enabled = this.largerButtons();
    const classList = this.document.documentElement.classList;
    if (enabled) {
      classList.add('buttons-larger');
    } else {
      classList.remove('buttons-larger');
    }
    localStorage.setItem(LARGER_BUTTONS_KEY, String(enabled));
    console.log('[CoreA11y] largerButtons:', enabled, '| html classes:', classList.toString());
  });

  private readonly _silentModeEffect = effect(() => {
    localStorage.setItem(SILENT_MODE_KEY, String(this.silentMode()));
  });

  private readonly _spacingEffect = effect(() => {
    const enabled = this.increasedSpacing();
    const classList = this.document.documentElement.classList;
    if (enabled) {
      classList.add('spacing-increased');
    } else {
      classList.remove('spacing-increased');
    }
    localStorage.setItem(SPACING_KEY, String(enabled));
  });

  private readonly _animationEffect = effect(() => {
    const speed = this.animationSpeed();
    const classList = this.document.documentElement.classList;
    classList.remove('animation-disabled', 'animation-slow');
    if (speed === 'none') classList.add('animation-disabled');
    if (speed === 'slow') classList.add('animation-slow');
    localStorage.setItem(ANIMATION_KEY, speed);
  });

  private loadFont(): FontSize {
    const stored = localStorage.getItem(FONT_KEY) as FontSize;
    return VALID_FONTS.includes(stored) ? stored : 'medium';
  }

  private loadTheme(): Theme {
    const stored = localStorage.getItem(THEME_KEY) as Theme;
    return VALID_THEMES.includes(stored) ? stored : 'default';
  }

  private loadVoiceReading(): boolean {
    return localStorage.getItem(VOICE_KEY) === 'true';
  }

  private loadDyslexiaFont(): boolean {
    return localStorage.getItem(DYSLEXIA_KEY) === 'true';
  }

  private loadSpeechRate(): number {
    const stored = parseFloat(localStorage.getItem(SPEECH_RATE_KEY) ?? '');
    return isNaN(stored) ? 0.9 : Math.min(1.5, Math.max(0.5, stored));
  }

  private loadAnimationSpeed(): AnimationSpeed {
    const stored = localStorage.getItem(ANIMATION_KEY) as AnimationSpeed;
    return VALID_ANIMATIONS.includes(stored) ? stored : 'normal';
  }

  /** Apply a full set of preferences loaded from Firestore. */
  applyPreferences(prefs: {
    fontSize: FontSize;
    theme: Theme;
    voiceReading: boolean;
    speechRate: number;
    dyslexiaFont: boolean;
    animationSpeed: AnimationSpeed;
    extraConfirmations: boolean;
    increasedSpacing: boolean;
    simplifiedNav: boolean;
    largerButtons?: boolean;
    silentMode?: boolean;
  }): void {
    this.fontSize.set(prefs.fontSize);
    this.theme.set(prefs.theme);
    this.voiceReading.set(prefs.voiceReading);
    this.speechRate.set(prefs.speechRate);
    this.dyslexiaFont.set(prefs.dyslexiaFont);
    this.animationSpeed.set(prefs.animationSpeed);
    this.extraConfirmations.set(prefs.extraConfirmations);
    this.increasedSpacing.set(prefs.increasedSpacing);
    this.simplifiedNav.set(prefs.simplifiedNav);
    this.largerButtons.set(prefs.largerButtons ?? false);
    this.silentMode.set(prefs.silentMode ?? false);
  }
}
