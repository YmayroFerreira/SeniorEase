import { Injectable } from '@angular/core';
import {
  ActivitySessionEntity,
  CompletedActivitiesEntity,
} from '../../domain/entities/activity.entity';
import { IActivitySessionRepository } from '../../domain/repositories/activity-session.repository';

@Injectable()
export class LocalStorageActivitySessionRepository implements IActivitySessionRepository {
  private static readonly SESSION_KEY = 'wizard-session';
  private static readonly COMPLETED_KEY = 'wizard-completed-activities';

  loadSession(): ActivitySessionEntity | null {
    try {
      const raw = localStorage.getItem(LocalStorageActivitySessionRepository.SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as ActivitySessionEntity;
    } catch {
      return null;
    }
  }

  saveSession(session: ActivitySessionEntity): void {
    localStorage.setItem(
      LocalStorageActivitySessionRepository.SESSION_KEY,
      JSON.stringify(session),
    );
  }

  clearSession(): void {
    localStorage.removeItem(LocalStorageActivitySessionRepository.SESSION_KEY);
  }

  loadCompleted(): CompletedActivitiesEntity {
    try {
      const raw = localStorage.getItem(LocalStorageActivitySessionRepository.COMPLETED_KEY);
      if (!raw) return { completedIds: [] };
      return { completedIds: JSON.parse(raw) as string[] };
    } catch {
      return { completedIds: [] };
    }
  }

  saveCompleted(completed: CompletedActivitiesEntity): void {
    localStorage.setItem(
      LocalStorageActivitySessionRepository.COMPLETED_KEY,
      JSON.stringify(completed.completedIds),
    );
  }

  clearCompleted(): void {
    localStorage.removeItem(LocalStorageActivitySessionRepository.COMPLETED_KEY);
  }
}
