import { Injectable } from '@angular/core';
import {
  AccessibilityAnimationSpeed,
  AccessibilityFontSize,
  AccessibilityPreferencesEntity,
  AccessibilityTheme,
  DEFAULT_ACCESSIBILITY_PREFERENCES,
} from '../../domain/entities/accessibility-preferences.entity';
import { IAccessibilityPreferencesRepository } from '../../domain/repositories/accessibility-preferences.repository';

const VALID_FONTS: AccessibilityFontSize[] = ['small', 'medium', 'large', 'x-large', 'xx-large'];
const VALID_THEMES: AccessibilityTheme[] = ['default', 'high-contrast', 'soft'];
const VALID_ANIMATIONS: AccessibilityAnimationSpeed[] = ['normal', 'slow', 'none'];

@Injectable()
export class LocalStorageAccessibilityRepository implements IAccessibilityPreferencesRepository {
  private static readonly KEYS = {
    fontSize: 'accessibility-font-size',
    theme: 'accessibility-theme',
    voiceReading: 'accessibility-voice-reading',
    speechRate: 'accessibility-speech-rate',
    dyslexiaFont: 'accessibility-dyslexia-font',
    animationSpeed: 'accessibility-animation-speed',
    extraConfirmations: 'profile-extra-confirmations',
    increasedSpacing: 'accessibility-increased-spacing',
    simplifiedNav: 'profile-simplified-nav',
  };

  load(): AccessibilityPreferencesEntity {
    const k = LocalStorageAccessibilityRepository.KEYS;
    const d = DEFAULT_ACCESSIBILITY_PREFERENCES;

    const rawFont = localStorage.getItem(k.fontSize) as AccessibilityFontSize;
    const rawTheme = localStorage.getItem(k.theme) as AccessibilityTheme;
    const rawAnim = localStorage.getItem(k.animationSpeed) as AccessibilityAnimationSpeed;
    const rawRate = parseFloat(localStorage.getItem(k.speechRate) ?? '');

    return {
      fontSize: VALID_FONTS.includes(rawFont) ? rawFont : d.fontSize,
      theme: VALID_THEMES.includes(rawTheme) ? rawTheme : d.theme,
      voiceReading: localStorage.getItem(k.voiceReading) === 'true',
      speechRate: isNaN(rawRate) ? d.speechRate : Math.min(1.5, Math.max(0.5, rawRate)),
      dyslexiaFont: localStorage.getItem(k.dyslexiaFont) === 'true',
      animationSpeed: VALID_ANIMATIONS.includes(rawAnim) ? rawAnim : d.animationSpeed,
      extraConfirmations: localStorage.getItem(k.extraConfirmations) === 'true',
      increasedSpacing: localStorage.getItem(k.increasedSpacing) === 'true',
      simplifiedNav: localStorage.getItem(k.simplifiedNav) === 'true',
    };
  }

  save(prefs: AccessibilityPreferencesEntity): void {
    const k = LocalStorageAccessibilityRepository.KEYS;
    localStorage.setItem(k.fontSize, prefs.fontSize);
    localStorage.setItem(k.theme, prefs.theme);
    localStorage.setItem(k.voiceReading, String(prefs.voiceReading));
    localStorage.setItem(k.speechRate, String(prefs.speechRate));
    localStorage.setItem(k.dyslexiaFont, String(prefs.dyslexiaFont));
    localStorage.setItem(k.animationSpeed, prefs.animationSpeed);
    localStorage.setItem(k.extraConfirmations, String(prefs.extraConfirmations));
    localStorage.setItem(k.increasedSpacing, String(prefs.increasedSpacing));
    localStorage.setItem(k.simplifiedNav, String(prefs.simplifiedNav));
  }
}
