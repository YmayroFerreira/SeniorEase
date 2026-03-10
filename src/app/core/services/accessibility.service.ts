import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';

export type FontSize = 'small' | 'medium' | 'large' | 'x-large' | 'xx-large';

const CLASS_MAP: Record<FontSize, string> = {
  small: 'font-small',
  medium: '',
  large: 'font-large',
  'x-large': 'font-x-large',
  'xx-large': 'font-xx-large',
};
const VALID: FontSize[] = ['small', 'medium', 'large', 'x-large', 'xx-large'];
const STORAGE_KEY = 'accessibility-font-size';

@Injectable({ providedIn: 'root' })
export class AccessibilityService {
  private readonly document = inject(DOCUMENT);

  readonly fontSize = signal<FontSize>(this.loadFromStorage());

  private readonly _applyEffect = effect(() => {
    const size = this.fontSize();
    const classList = this.document.documentElement.classList;

    classList.remove('font-small', 'font-large', 'font-x-large', 'font-xx-large');
    const cls = CLASS_MAP[size];
    if (cls) classList.add(cls);

    localStorage.setItem(STORAGE_KEY, size);
  });

  private loadFromStorage(): FontSize {
    const stored = localStorage.getItem(STORAGE_KEY) as FontSize;
    return VALID.includes(stored) ? stored : 'medium';
  }
}
