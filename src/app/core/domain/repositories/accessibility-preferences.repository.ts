import { InjectionToken } from '@angular/core';
import { AccessibilityPreferencesEntity } from '../entities/accessibility-preferences.entity';

export interface IAccessibilityPreferencesRepository {
  load(): AccessibilityPreferencesEntity;
  save(prefs: AccessibilityPreferencesEntity): void;
}

export const ACCESSIBILITY_PREFERENCES_REPOSITORY =
  new InjectionToken<IAccessibilityPreferencesRepository>('IAccessibilityPreferencesRepository');
