import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccessibilityFirestoreService } from '../../core/services/accessibility-firestore.service';
import { AccessibilityService } from '../../core/services/accessibility.service';
import { AuthService } from '../../core/services/auth.service';
import { UserFirestoreService } from '../../core/services/user-firestore.service';

@Component({
  selector: 'app-auth-callback',
  template: `
    <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;">
      <p style="font-family:sans-serif;color:#536070;">Autenticando...</p>
    </div>
  `,
})
export class AuthCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private userFirestoreService = inject(UserFirestoreService);
  private accessibilityFirestoreService = inject(AccessibilityFirestoreService);
  private accessibilityService = inject(AccessibilityService);

  async ngOnInit(): Promise<void> {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      this.authService.storeToken(token);
      if (this.authService.isTokenValid()) {
        await this.loadUserDataFromFirestore();
        this.router.navigate(['/inicio'], { replaceUrl: true });
        return;
      }
    }

    this.authService.clearToken();
    window.location.href = this.authService.loginUrl;
  }

  private async loadUserDataFromFirestore(): Promise<void> {
    const [accessibilityPrefs, profileFound] = await Promise.all([
      this.accessibilityFirestoreService.loadToLocalStorage(),
      this.userFirestoreService.loadToLocalStorage(),
    ]);

    if (!profileFound) {
      this.seedProfileFromToken();
    }

    if (accessibilityPrefs) {
      this.accessibilityService.applyPreferences(accessibilityPrefs);
    }
  }

  private seedProfileFromToken(): void {
    const name = this.authService.getUserName();
    const email = this.authService.getUserEmail();
    if (name) localStorage.setItem('profile-name', name);
    if (email) localStorage.setItem('profile-email', email);
    // Persist seed to Firestore so subsequent logins load correctly
    this.userFirestoreService.save({
      id: this.authService.getUserId() ?? '',
      name: name ?? '',
      email: email ?? '',
      phone: '',
      dateOfBirth: '',
      cpf: '',
      profileImageBase64: null,
    });
  }
}
