import { inject, Injectable } from '@angular/core';
import { ActivitySessionEntity } from '../../domain/entities/activity.entity';
import { ACTIVITY_SESSION_REPOSITORY } from '../../domain/repositories/activity-session.repository';

@Injectable({ providedIn: 'root' })
export class GetActivitySessionUseCase {
  private readonly repo = inject(ACTIVITY_SESSION_REPOSITORY);

  execute(): ActivitySessionEntity | null {
    return this.repo.loadSession();
  }
}
