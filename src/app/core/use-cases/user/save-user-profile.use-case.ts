import { inject, Injectable } from '@angular/core';
import { UserEntity } from '../../domain/entities/user.entity';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';

@Injectable({ providedIn: 'root' })
export class SaveUserProfileUseCase {
  private readonly repo = inject(USER_REPOSITORY);

  execute(user: UserEntity): void {
    if (!user.name.trim()) throw new Error('O nome é obrigatório.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) throw new Error('E-mail inválido.');
    if (!user.phone.trim()) throw new Error('O telefone é obrigatório.');
    this.repo.save(user);
  }
}
