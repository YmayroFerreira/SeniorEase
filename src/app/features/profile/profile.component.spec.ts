import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AccessibilityService } from '@senior-ease/ui';
import { AuthService } from '../../core/services/auth.service';
import { UserFirestoreService } from '../../core/services/user-firestore.service';
import { ProfileComponent } from './profile.component';

const mockAccessibilityService = {
  simplifiedNav: signal(false),
  extraConfirmations: signal(false),
  theme: signal('default'),
  voiceReading: signal(false),
};

const mockAuthService = {
  getUserId: vi.fn().mockReturnValue('user-teste'),
  clearToken: vi.fn(),
  loginUrl: 'http://localhost:4201',
};

const mockUserFirestoreService = {
  save: vi.fn(),
};

describe('ProfileComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [ProfileComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: AccessibilityService, useValue: mockAccessibilityService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserFirestoreService, useValue: mockUserFirestoreService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ProfileComponent, {
        set: {
          imports: [TranslateModule],
          template: `
            <div data-testid="perfil">
              <input data-testid="campo-nome" [value]="userName()" />
              <input data-testid="campo-email" [value]="email()" />
              <input data-testid="campo-telefone" [value]="phone()" />
              <button data-testid="btn-salvar" (click)="saveProfile()">Salvar</button>
              <button data-testid="btn-logout" (click)="logout()">Sair</button>
              @if (toastVisible()) {
                <div data-testid="toast">{{ toastMessage() }}</div>
              }
            </div>
          `,
        },
      })
      .compileComponents();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('deve criar o componente', () => {
    const fixture = TestBed.createComponent(ProfileComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve renderizar o formulário de perfil na tela', () => {
    const fixture = TestBed.createComponent(ProfileComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[data-testid="perfil"]')).not.toBeNull();
  });

  it('deve renderizar os campos de nome, e-mail e telefone', () => {
    const fixture = TestBed.createComponent(ProfileComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[data-testid="campo-nome"]')).not.toBeNull();
    expect(el.querySelector('[data-testid="campo-email"]')).not.toBeNull();
    expect(el.querySelector('[data-testid="campo-telefone"]')).not.toBeNull();
  });

  it('deve renderizar o botão de salvar', () => {
    const fixture = TestBed.createComponent(ProfileComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[data-testid="btn-salvar"]')).not.toBeNull();
  });

  it('deve renderizar o botão de logout', () => {
    const fixture = TestBed.createComponent(ProfileComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[data-testid="btn-logout"]')).not.toBeNull();
  });

  describe('Validações do formulário', () => {
    it('nameValid deve ser false quando o nome está vazio', () => {
      const fixture = TestBed.createComponent(ProfileComponent);
      const component = fixture.componentInstance as ProfileComponent & {
        nameValid: () => boolean;
      };
      component['userName'].set('');
      expect(component['nameValid']()).toBe(false);
    });

    it('nameValid deve ser true quando o nome está preenchido', () => {
      const fixture = TestBed.createComponent(ProfileComponent);
      const component = fixture.componentInstance as ProfileComponent & {
        nameValid: () => boolean;
      };
      component['userName'].set('Maria Silva');
      expect(component['nameValid']()).toBe(true);
    });

    it('emailValid deve ser false para e-mail inválido', () => {
      const fixture = TestBed.createComponent(ProfileComponent);
      const component = fixture.componentInstance as ProfileComponent & {
        emailValid: () => boolean;
      };
      component['email'].set('email-invalido');
      expect(component['emailValid']()).toBe(false);
    });

    it('emailValid deve ser true para e-mail válido', () => {
      const fixture = TestBed.createComponent(ProfileComponent);
      const component = fixture.componentInstance as ProfileComponent & {
        emailValid: () => boolean;
      };
      component['email'].set('maria@exemplo.com');
      expect(component['emailValid']()).toBe(true);
    });

    it('phoneValid deve ser false quando o telefone está vazio', () => {
      const fixture = TestBed.createComponent(ProfileComponent);
      const component = fixture.componentInstance as ProfileComponent & {
        phoneValid: () => boolean;
      };
      component['phone'].set('');
      expect(component['phoneValid']()).toBe(false);
    });

    it('phoneValid deve ser true quando o telefone está preenchido', () => {
      const fixture = TestBed.createComponent(ProfileComponent);
      const component = fixture.componentInstance as ProfileComponent & {
        phoneValid: () => boolean;
      };
      component['phone'].set('11999999999');
      expect(component['phoneValid']()).toBe(true);
    });
  });

  describe('saveProfile', () => {
    it('deve salvar os dados no localStorage quando o formulário é válido', () => {
      const fixture = TestBed.createComponent(ProfileComponent);
      const component = fixture.componentInstance as ProfileComponent;
      component['userName'].set('Maria Silva');
      component['email'].set('maria@exemplo.com');
      component['phone'].set('11999999999');

      component['saveProfile']();

      expect(localStorage.getItem('profile-name')).toBe('Maria Silva');
      expect(localStorage.getItem('profile-email')).toBe('maria@exemplo.com');
      expect(localStorage.getItem('profile-phone')).toBe('11999999999');
    });

    it('deve chamar userFirestoreService.save ao salvar perfil válido', () => {
      const fixture = TestBed.createComponent(ProfileComponent);
      const component = fixture.componentInstance as ProfileComponent;
      component['userName'].set('João Teste');
      component['email'].set('joao@exemplo.com');
      component['phone'].set('21988888888');

      component['saveProfile']();

      expect(mockUserFirestoreService.save).toHaveBeenCalledTimes(1);
    });

    it('não deve salvar no localStorage quando o formulário é inválido', () => {
      const fixture = TestBed.createComponent(ProfileComponent);
      const component = fixture.componentInstance as ProfileComponent;
      component['userName'].set('');
      component['email'].set('email-invalido');
      component['phone'].set('');

      component['saveProfile']();

      expect(localStorage.getItem('profile-name')).toBeNull();
    });
  });

  describe('logout', () => {
    it('deve chamar clearToken ao fazer logout', () => {
      const fixture = TestBed.createComponent(ProfileComponent);
      const component = fixture.componentInstance as ProfileComponent;

      Object.defineProperty(window, 'location', { value: { href: '' }, writable: true });

      component['logout']();

      expect(mockAuthService.clearToken).toHaveBeenCalledTimes(1);
    });
  });

  it('deve carregar dados do perfil do localStorage ao inicializar', () => {
    localStorage.setItem('profile-name', 'Carlos Souza');
    localStorage.setItem('profile-email', 'carlos@exemplo.com');

    const fixture = TestBed.createComponent(ProfileComponent);
    const component = fixture.componentInstance as ProfileComponent;

    expect(component['userName']()).toBe('Carlos Souza');
    expect(component['email']()).toBe('carlos@exemplo.com');
  });
});
