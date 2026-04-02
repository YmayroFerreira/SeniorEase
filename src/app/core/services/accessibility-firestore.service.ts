import { inject, Injectable } from '@angular/core';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
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
   * Returns the loaded prefs so the caller can update signals.
   */
  async loadToLocalStorage(): Promise<AccessibilityPreferencesEntity | null> {
    const uid = this.authService.getUserId();
    if (!uid) return null;
    try {
      const snap = await getDoc(doc(this.firestore, `accessibilityPreferences/${uid}`));
      if (!snap.exists()) return null;
      const data = {
        ...DEFAULT_ACCESSIBILITY_PREFERENCES,
        ...(snap.data() as Partial<AccessibilityPreferencesEntity>),
      };
      localStorage.setItem('accessibility-font-size', data.fontSize);
      localStorage.setItem('accessibility-theme', data.theme);
      localStorage.setItem('accessibility-voice-reading', String(data.voiceReading));
      localStorage.setItem('accessibility-speech-rate', String(data.speechRate));
      localStorage.setItem('accessibility-dyslexia-font', String(data.dyslexiaFont));
      localStorage.setItem('accessibility-animation-speed', data.animationSpeed);
      localStorage.setItem('profile-extra-confirmations', String(data.extraConfirmations));
      localStorage.setItem('accessibility-increased-spacing', String(data.increasedSpacing));
      localStorage.setItem('profile-simplified-nav', String(data.simplifiedNav));
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
