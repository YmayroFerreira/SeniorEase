import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';

export type FontSize = 'small' | 'medium' | 'large' | 'x-large' | 'xx-large';
export type Theme = 'default' | 'high-contrast' | 'soft';

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

@Injectable({ providedIn: 'root' })
export class AccessibilityService {
  private readonly document = inject(DOCUMENT);

  readonly fontSize = signal<FontSize>(this.loadFont());
  readonly theme = signal<Theme>(this.loadTheme());
  readonly voiceReading = signal<boolean>(this.loadVoiceReading());
  readonly speechRate = signal<number>(this.loadSpeechRate());
  readonly dyslexiaFont = signal<boolean>(this.loadDyslexiaFont());

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
}
