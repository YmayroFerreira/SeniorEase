import { inject, Injectable } from '@angular/core';
import { AccessibilityPreferencesEntity } from '../../domain/entities/accessibility-preferences.entity';
import { ACCESSIBILITY_PREFERENCES_REPOSITORY } from '../../domain/repositories/accessibility-preferences.repository';

@Injectable({ providedIn: 'root' })
export class SaveAccessibilityPreferencesUseCase {
  private readonly repo = inject(ACCESSIBILITY_PREFERENCES_REPOSITORY);

  execute(prefs: AccessibilityPreferencesEntity): void {
    this.repo.save(prefs);
  }
}
