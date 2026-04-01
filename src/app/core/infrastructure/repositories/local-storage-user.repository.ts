import { Injectable } from '@angular/core';
import { UserEntity } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class LocalStorageUserRepository implements IUserRepository {
  private static readonly KEYS = {
    name: 'profile-name',
    email: 'profile-email',
    phone: 'profile-phone',
    dob: 'profile-dob',
    cpf: 'profile-cpf',
    image: 'profile-image',
  };

  load(): UserEntity {
    const k = LocalStorageUserRepository.KEYS;
    return {
      id: 'local-user',
      name: localStorage.getItem(k.name) ?? 'Sr. Arnaldo',
      email: localStorage.getItem(k.email) ?? 'arnaldo@email.com',
      phone: localStorage.getItem(k.phone) ?? '(11) 98765-4321',
      dateOfBirth: localStorage.getItem(k.dob) ?? '',
      cpf: localStorage.getItem(k.cpf) ?? '',
      profileImageBase64: localStorage.getItem(k.image),
    };
  }

  save(user: UserEntity): void {
    const k = LocalStorageUserRepository.KEYS;
    localStorage.setItem(k.name, user.name);
    localStorage.setItem(k.email, user.email);
    localStorage.setItem(k.phone, user.phone);
    localStorage.setItem(k.dob, user.dateOfBirth);
    localStorage.setItem(k.cpf, user.cpf);
    if (user.profileImageBase64) {
      localStorage.setItem(k.image, user.profileImageBase64);
    }
  }
}
