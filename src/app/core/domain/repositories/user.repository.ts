import { InjectionToken } from '@angular/core';
import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
  load(): UserEntity;
  save(user: UserEntity): void;
}

export const USER_REPOSITORY = new InjectionToken<IUserRepository>('IUserRepository');
