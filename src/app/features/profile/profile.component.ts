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
import { LoadUserProfileUseCase } from '../../core/use-cases/user/load-user-profile.use-case';
import { SaveUserProfileUseCase } from '../../core/use-cases/user/save-user-profile.use-case';
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
  private readonly accessibilityService = inject(AccessibilityService);
  private readonly translate = inject(TranslateService);
  private readonly loadProfileUC = inject(LoadUserProfileUseCase);
  private readonly saveProfileUC = inject(SaveUserProfileUseCase);

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

  private readonly _profile = this.loadProfileUC.execute();
  protected readonly profileImage = signal<string | null>(this._profile.profileImageBase64);
  protected readonly userName = signal(this._profile.name);
  protected readonly email = signal(this._profile.email);
  protected readonly phone = signal(this._profile.phone);
  protected readonly dob = signal(this._profile.dateOfBirth);
  protected readonly cpf = signal(this._profile.cpf);
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
    try {
      this.saveProfileUC.execute({
        id: 'local-user',
        name: this.userName(),
        email: this.email(),
        phone: this.phone(),
        dateOfBirth: this.dob(),
        cpf: this.cpf(),
        profileImageBase64: this.profileImage(),
      });
      this.showToast(this.translate.instant('PROFILE.TOAST_SUCCESS'), true);
    } catch {
      this.showToast(this.translate.instant('PROFILE.TOAST_INVALID'), false);
    }
  }

  protected changePassword(): void {
    this.showToast(this.translate.instant('COMMON.SOON'), true);
  }

  protected logout(): void {
    this.router.navigate(['/inicio']);
  }

  private showToast(message: string, success: boolean): void {
    this.toastMessage.set(message);
    this.toastSuccess.set(success);
    this.toastVisible.set(true);
    setTimeout(() => this.toastVisible.set(false), 3000);
  }
}
