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

@Injectable({ providedIn: 'root' })
export class AccessibilityService {
  private readonly document = inject(DOCUMENT);

  readonly fontSize = signal<FontSize>(this.loadFont());
  readonly theme = signal<Theme>(this.loadTheme());

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

  private loadFont(): FontSize {
    const stored = localStorage.getItem(FONT_KEY) as FontSize;
    return VALID_FONTS.includes(stored) ? stored : 'medium';
  }

  private loadTheme(): Theme {
    const stored = localStorage.getItem(THEME_KEY) as Theme;
    return VALID_THEMES.includes(stored) ? stored : 'default';
  }
}
