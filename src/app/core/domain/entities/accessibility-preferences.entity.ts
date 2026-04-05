export type AccessibilityFontSize = 'small' | 'medium' | 'large' | 'x-large' | 'xx-large';
export type AccessibilityTheme = 'default' | 'high-contrast' | 'soft';
export type AccessibilityAnimationSpeed = 'normal' | 'slow' | 'none';

export interface AccessibilityPreferencesEntity {
  fontSize: AccessibilityFontSize;
  theme: AccessibilityTheme;
  voiceReading: boolean;
  speechRate: number;
  dyslexiaFont: boolean;
  animationSpeed: AccessibilityAnimationSpeed;
  extraConfirmations: boolean;
  increasedSpacing: boolean;
  simplifiedNav: boolean;
  largerButtons: boolean;
  silentMode: boolean;
}

export const DEFAULT_ACCESSIBILITY_PREFERENCES: AccessibilityPreferencesEntity = {
  fontSize: 'medium',
  theme: 'default',
  voiceReading: false,
  speechRate: 0.9,
  dyslexiaFont: false,
  animationSpeed: 'normal',
  extraConfirmations: false,
  increasedSpacing: false,
  simplifiedNav: false,
  largerButtons: false,
  silentMode: false,
};
