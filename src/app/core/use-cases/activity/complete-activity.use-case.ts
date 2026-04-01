import { inject, Injectable } from '@angular/core';
import { ACTIVITY_SESSION_REPOSITORY } from '../../domain/repositories/activity-session.repository';

@Injectable({ providedIn: 'root' })
export class CompleteActivityUseCase {
  private readonly repo = inject(ACTIVITY_SESSION_REPOSITORY);

  execute(activityId: string, currentCompleted: Set<string>): Set<string> {
    const updated = new Set(currentCompleted);
    updated.add(activityId);
    this.repo.saveCompleted({ completedIds: [...updated] });
    this.repo.clearSession();
    return updated;
  }

  reset(): void {
    this.repo.clearCompleted();
    this.repo.clearSession();
  }
}
