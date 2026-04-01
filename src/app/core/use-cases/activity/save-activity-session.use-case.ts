import { inject, Injectable } from '@angular/core';
import { ActivitySessionEntity } from '../../domain/entities/activity.entity';
import { ACTIVITY_SESSION_REPOSITORY } from '../../domain/repositories/activity-session.repository';

@Injectable({ providedIn: 'root' })
export class SaveActivitySessionUseCase {
  private readonly repo = inject(ACTIVITY_SESSION_REPOSITORY);

  execute(session: ActivitySessionEntity): void {
    this.repo.saveSession(session);
  }
}
