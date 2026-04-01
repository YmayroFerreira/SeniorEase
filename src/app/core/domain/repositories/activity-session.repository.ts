import { InjectionToken } from '@angular/core';
import { ActivitySessionEntity, CompletedActivitiesEntity } from '../entities/activity.entity';

export interface IActivitySessionRepository {
  loadSession(): ActivitySessionEntity | null;
  saveSession(session: ActivitySessionEntity): void;
  clearSession(): void;
  loadCompleted(): CompletedActivitiesEntity;
  saveCompleted(completed: CompletedActivitiesEntity): void;
  clearCompleted(): void;
}

export const ACTIVITY_SESSION_REPOSITORY = new InjectionToken<IActivitySessionRepository>(
  'IActivitySessionRepository',
);
