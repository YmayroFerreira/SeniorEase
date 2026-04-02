import { inject, Injectable } from '@angular/core';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { UserEntity } from '../domain/entities/user.entity';
import { AuthService } from './auth.service';

const LS_KEYS = {
  name: 'profile-name',
  email: 'profile-email',
  phone: 'profile-phone',
  dob: 'profile-dob',
  cpf: 'profile-cpf',
};

@Injectable({ providedIn: 'root' })
export class UserFirestoreService {
  private readonly firestore = inject(Firestore);
  private readonly authService = inject(AuthService);

  /**
   * Load user profile from Firestore and write to localStorage (cache).
   * Returns true if a profile document was found, false otherwise.
   */
  async loadToLocalStorage(): Promise<boolean> {
    const uid = this.authService.getUserId();
    if (!uid) return false;
    try {
      const snap = await getDoc(doc(this.firestore, `userProfiles/${uid}`));
      if (!snap.exists()) return false;
      const data = snap.data() as Partial<UserEntity>;
      if (data.name) localStorage.setItem(LS_KEYS.name, data.name);
      if (data.email) localStorage.setItem(LS_KEYS.email, data.email);
      if (data.phone) localStorage.setItem(LS_KEYS.phone, data.phone);
      if (data.dateOfBirth != null) localStorage.setItem(LS_KEYS.dob, data.dateOfBirth);
      if (data.cpf != null) localStorage.setItem(LS_KEYS.cpf, data.cpf);
      return true;
    } catch {
      return false;
    }
  }

  /** Save user profile to Firestore. Image stays in localStorage only (size). */
  async save(user: UserEntity): Promise<void> {
    const uid = this.authService.getUserId();
    if (!uid) return;
    const { profileImageBase64, id, ...firestoreData } = user;
    await setDoc(doc(this.firestore, `userProfiles/${uid}`), firestoreData, { merge: true });
  }
}
