import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faBars,
  faCalendar,
  faCamera,
  faCheckDouble,
  faCircleCheck,
  faCircleInfo,
  faEnvelope,
  faFileContract,
  faHeadset,
  faIdCard,
  faLock,
  faPhone,
  faRightFromBracket,
  faTriangleExclamation,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  AccessibilityService,
  CardButtonComponent,
  DividerComponent,
  IconComponent,
} from '@senior-ease/ui';
import { AuthService } from '../../core/services/auth.service';
import { UserFirestoreService } from '../../core/services/user-firestore.service';
import { VoiceReadDirective } from '../../shared/directives/voice-read.directive';

@Component({
  selector: 'app-profile',
  imports: [
    RouterLink,
    FontAwesomeModule,
    VoiceReadDirective,
    TranslatePipe,
    CardButtonComponent,
    DividerComponent,
    IconComponent,
  ],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly userFirestoreService = inject(UserFirestoreService);
  private readonly accessibilityService = inject(AccessibilityService);
  private readonly translate = inject(TranslateService);

  protected readonly icons = {
    arrowLeft: faArrowLeft,
    user: faUser,
    camera: faCamera,
    envelope: faEnvelope,
    phone: faPhone,
    calendar: faCalendar,
    idCard: faIdCard,
    simplifiedNav: faBars,
    extraConfirmations: faCheckDouble,
    lock: faLock,
    logout: faRightFromBracket,
    headset: faHeadset,
    fileContract: faFileContract,
    info: faCircleInfo,
    circleCheck: faCircleCheck,
    warning: faTriangleExclamation,
  };

  protected readonly APP_VERSION = '1.0.0';

  protected readonly profileImage = signal<string | null>(localStorage.getItem('profile-image'));
  protected readonly userName = signal(localStorage.getItem('profile-name') ?? '');
  protected readonly email = signal(localStorage.getItem('profile-email') ?? '');
  protected readonly phone = signal(localStorage.getItem('profile-phone') ?? '');
  protected readonly cpf = signal(localStorage.getItem('profile-cpf') ?? '');

  // Data de nascimento separada em dia/mês/ano para compatibilidade cross-browser
  private static parseDob(raw: string): { day: string; month: string; year: string } {
    if (!raw) return { day: '', month: '', year: '' };
    const parts = raw.split('-');
    if (parts.length === 3) return { day: parts[2], month: parts[1], year: parts[0] };
    return { day: '', month: '', year: '' };
  }

  private readonly _dob = ProfileComponent.parseDob(localStorage.getItem('profile-dob') ?? '');
  protected readonly dobDay = signal(this._dob.day);
  protected readonly dobMonth = signal(this._dob.month);
  protected readonly dobYear = signal(this._dob.year);

  protected readonly dobFormatted = computed(() => {
    const d = this.dobDay(),
      m = this.dobMonth(),
      y = this.dobYear();
    if (!d || !m || !y) return '';
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  });

  protected readonly days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  protected readonly months = [
    { value: '01', label: 'Janeiro' },
    { value: '02', label: 'Fevereiro' },
    { value: '03', label: 'Março' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Maio' },
    { value: '06', label: 'Junho' },
    { value: '07', label: 'Julho' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' },
  ];
  protected readonly years = Array.from({ length: 100 }, (_, i) =>
    String(new Date().getFullYear() - i),
  );
  protected readonly simplifiedNav = this.accessibilityService.simplifiedNav;
  protected readonly extraConfirmations = this.accessibilityService.extraConfirmations;

  protected readonly saveAttempted = signal(false);
  protected readonly toastVisible = signal(false);
  protected readonly toastMessage = signal('');
  protected readonly toastSuccess = signal(true);

  protected readonly nameValid = computed(() => this.userName().trim().length > 0);
  protected readonly emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email()));
  protected readonly phoneValid = computed(() => this.phone().trim().length > 0);

  protected onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.profileImage.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  protected saveProfile(): void {
    this.saveAttempted.set(true);
    if (!this.nameValid() || !this.emailValid() || !this.phoneValid()) {
      this.showToast(this.translate.instant('PROFILE.TOAST_INVALID'), false);
      return;
    }
    localStorage.setItem('profile-name', this.userName());
    localStorage.setItem('profile-email', this.email());
    localStorage.setItem('profile-phone', this.phone());
    localStorage.setItem('profile-dob', this.dobFormatted());
    localStorage.setItem('profile-cpf', this.cpf());
    if (this.profileImage()) {
      localStorage.setItem('profile-image', this.profileImage()!);
    }
    this.userFirestoreService.save({
      id: this.authService.getUserId() ?? 'local-user',
      name: this.userName(),
      email: this.email(),
      phone: this.phone(),
      dateOfBirth: this.dobFormatted(),
      cpf: this.cpf(),
      profileImageBase64: this.profileImage(),
    });
    this.showToast(this.translate.instant('PROFILE.TOAST_SUCCESS'), true);
  }

  protected changePassword(): void {
    this.showToast(this.translate.instant('COMMON.SOON'), true);
  }

  protected logout(): void {
    this.authService.clearToken();
    window.location.href = this.authService.loginUrl;
  }

  private showToast(message: string, success: boolean): void {
    this.toastMessage.set(message);
    this.toastSuccess.set(success);
    this.toastVisible.set(true);
    setTimeout(() => this.toastVisible.set(false), 3000);
  }
}
