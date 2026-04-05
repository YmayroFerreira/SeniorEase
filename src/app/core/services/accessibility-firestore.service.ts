import { inject, Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  AccessibilityPreferencesEntity,
  DEFAULT_ACCESSIBILITY_PREFERENCES,
} from '../domain/entities/accessibility-preferences.entity';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AccessibilityFirestoreService {
  private readonly firestore = inject(Firestore);
  private readonly authService = inject(AuthService);

  /**
   * Load accessibility prefs from Firestore and write to localStorage.
   * Always ensures all fields exist in Firestore (migrates old documents).
   * Returns the loaded prefs so the caller can update signals.
   */
  async loadToLocalStorage(): Promise<AccessibilityPreferencesEntity | null> {
    const uid = this.authService.getUserId();
    if (!uid) return null;
    [
      'accessibility-font-size',
      'accessibility-theme',
      'accessibility-voice-reading',
      'accessibility-speech-rate',
      'accessibility-dyslexia-font',
      'accessibility-animation-speed',
      'profile-extra-confirmations',
      'accessibility-increased-spacing',
      'profile-simplified-nav',
      'accessibility-larger-buttons',
      'accessibility-silent-mode',
    ].forEach((key) => localStorage.removeItem(key));
    try {
      const snap = await getDoc(doc(this.firestore, `accessibilityPreferences/${uid}`));
      if (!snap.exists()) return null;

      const rawData = snap.data() as Partial<AccessibilityPreferencesEntity>;
      // Merge com defaults para garantir que campos novos existam
      const data: AccessibilityPreferencesEntity = {
        ...DEFAULT_ACCESSIBILITY_PREFERENCES,
        ...rawData,
      };

      // Se algum campo do default não existe no documento, salva o documento completo
      const hasAllFields = Object.keys(DEFAULT_ACCESSIBILITY_PREFERENCES).every(
        (key) => key in rawData,
      );
      if (!hasAllFields) {
        setDoc(doc(this.firestore, `accessibilityPreferences/${uid}`), data, { merge: true });
      }

      localStorage.setItem('accessibility-font-size', data.fontSize);
      localStorage.setItem('accessibility-theme', data.theme);
      localStorage.setItem('accessibility-voice-reading', String(data.voiceReading));
      localStorage.setItem('accessibility-speech-rate', String(data.speechRate));
      localStorage.setItem('accessibility-dyslexia-font', String(data.dyslexiaFont));
      localStorage.setItem('accessibility-animation-speed', data.animationSpeed);
      localStorage.setItem('profile-extra-confirmations', String(data.extraConfirmations));
      localStorage.setItem('accessibility-increased-spacing', String(data.increasedSpacing));
      localStorage.setItem('profile-simplified-nav', String(data.simplifiedNav));
      localStorage.setItem('accessibility-larger-buttons', String(data.largerButtons));
      localStorage.setItem('accessibility-silent-mode', String(data.silentMode));
      return data;
    } catch {
      return null;
    }
  }

  /** Save accessibility prefs to Firestore. */
  async save(prefs: AccessibilityPreferencesEntity): Promise<void> {
    const uid = this.authService.getUserId();
    if (!uid) return;
    await setDoc(doc(this.firestore, `accessibilityPreferences/${uid}`), prefs, { merge: true });
  }
}
