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
import { VoiceReadDirective } from '../../shared/directives/voice-read.directive';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, FontAwesomeModule, VoiceReadDirective],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  private readonly router = inject(Router);

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

  // Dados carregados do localStorage
  protected readonly profileImage = signal<string | null>(localStorage.getItem('profile-image'));
  protected readonly userName = signal(localStorage.getItem('profile-name') ?? 'Sr. Arnaldo');
  protected readonly email = signal(localStorage.getItem('profile-email') ?? 'arnaldo@email.com');
  protected readonly phone = signal(localStorage.getItem('profile-phone') ?? '(11) 98765-4321');
  protected readonly dob = signal(localStorage.getItem('profile-dob') ?? '');
  protected readonly cpf = signal(localStorage.getItem('profile-cpf') ?? '');
  protected readonly simplifiedNav = signal(
    localStorage.getItem('profile-simplified-nav') === 'true',
  );
  protected readonly extraConfirmations = signal(
    localStorage.getItem('profile-extra-confirmations') === 'true',
  );

  // UI state
  protected readonly saveAttempted = signal(false);
  protected readonly toastVisible = signal(false);
  protected readonly toastMessage = signal('');
  protected readonly toastSuccess = signal(true);

  // Validações
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
      this.showToast('Corrija os campos inválidos antes de salvar.', false);
      return;
    }
    localStorage.setItem('profile-name', this.userName());
    localStorage.setItem('profile-email', this.email());
    localStorage.setItem('profile-phone', this.phone());
    localStorage.setItem('profile-dob', this.dob());
    localStorage.setItem('profile-cpf', this.cpf());
    localStorage.setItem('profile-simplified-nav', String(this.simplifiedNav()));
    localStorage.setItem('profile-extra-confirmations', String(this.extraConfirmations()));
    if (this.profileImage()) {
      localStorage.setItem('profile-image', this.profileImage()!);
    }
    this.showToast('Perfil salvo com sucesso!', true);
  }

  protected changePassword(): void {
    this.showToast('Funcionalidade disponível em breve.', true);
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
