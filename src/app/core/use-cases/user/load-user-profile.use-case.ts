import { inject, Injectable } from '@angular/core';
import { UserEntity } from '../../domain/entities/user.entity';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';

@Injectable({ providedIn: 'root' })
export class LoadUserProfileUseCase {
  private readonly repo = inject(USER_REPOSITORY);

  execute(): UserEntity {
    return this.repo.load();
  }
}
