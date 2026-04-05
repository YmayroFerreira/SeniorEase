import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let authService: AuthService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), AuthService],
    });
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('deve permitir a navegação quando o token é válido', () => {
    vi.spyOn(authService, 'isTokenValid').mockReturnValue(true);

    const resultado = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(resultado).toBe(true);
  });

  it('deve chamar clearToken quando o token é inválido', () => {
    vi.spyOn(authService, 'isTokenValid').mockReturnValue(false);
    const clearSpy = vi.spyOn(authService, 'clearToken');

    // Sobrescreve window.location para evitar redirecionamento real
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });

    TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(clearSpy).toHaveBeenCalledTimes(1);
  });

  it('deve redirecionar para a URL de login quando o token é inválido', () => {
    vi.spyOn(authService, 'isTokenValid').mockReturnValue(false);

    const locationMock = { href: '' };
    Object.defineProperty(window, 'location', {
      value: locationMock,
      writable: true,
    });

    TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(locationMock.href).toBe(authService.loginUrl);
  });

  it('não deve chamar clearToken quando o token é válido', () => {
    vi.spyOn(authService, 'isTokenValid').mockReturnValue(true);
    const clearSpy = vi.spyOn(authService, 'clearToken');

    TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(clearSpy).not.toHaveBeenCalled();
  });
});
