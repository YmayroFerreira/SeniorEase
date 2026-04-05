import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

function criarToken(payload: object): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload)).replace(/=+$/, '');
  return `${header}.${body}.assinatura`;
}

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('storeToken / getToken / clearToken', () => {
    it('deve armazenar e recuperar o token da sessão', () => {
      service.storeToken('meu-token-teste');
      expect(service.getToken()).toBe('meu-token-teste');
    });

    it('deve retornar null quando não há token armazenado', () => {
      expect(service.getToken()).toBeNull();
    });

    it('deve remover o token ao chamar clearToken', () => {
      service.storeToken('meu-token-teste');
      service.clearToken();
      expect(service.getToken()).toBeNull();
    });
  });

  describe('isTokenValid', () => {
    it('deve retornar false quando não há token', () => {
      expect(service.isTokenValid()).toBe(false);
    });

    it('deve retornar true com token válido e não expirado', () => {
      const exp = Math.floor(Date.now() / 1000) + 3600;
      const token = criarToken({ sub: 'user-1', email: 'teste@exemplo.com', exp });
      service.storeToken(token);
      expect(service.isTokenValid()).toBe(true);
    });

    it('deve retornar false com token expirado', () => {
      const exp = Math.floor(Date.now() / 1000) - 3600;
      const token = criarToken({ sub: 'user-1', email: 'teste@exemplo.com', exp });
      service.storeToken(token);
      expect(service.isTokenValid()).toBe(false);
    });

    it('deve retornar false com token malformado', () => {
      service.storeToken('token-invalido-sem-partes');
      expect(service.isTokenValid()).toBe(false);
    });
  });

  describe('getTokenPayload', () => {
    it('deve retornar null quando não há token', () => {
      expect(service.getTokenPayload()).toBeNull();
    });

    it('deve retornar o payload decodificado do token', () => {
      const exp = Math.floor(Date.now() / 1000) + 3600;
      const token = criarToken({ sub: 'user-42', email: 'joao@exemplo.com', exp, name: 'João' });
      service.storeToken(token);
      const payload = service.getTokenPayload();
      expect(payload?.sub).toBe('user-42');
      expect(payload?.email).toBe('joao@exemplo.com');
    });
  });

  describe('getUserId / getUserEmail / getUserName', () => {
    beforeEach(() => {
      const exp = Math.floor(Date.now() / 1000) + 3600;
      const token = criarToken({
        sub: 'user-123',
        email: 'joao@exemplo.com',
        exp,
        name: 'João Silva',
      });
      service.storeToken(token);
    });

    it('deve retornar o ID do usuário a partir do token', () => {
      expect(service.getUserId()).toBe('user-123');
    });

    it('deve retornar o e-mail do usuário a partir do token', () => {
      expect(service.getUserEmail()).toBe('joao@exemplo.com');
    });

    it('deve retornar o nome do usuário a partir do token', () => {
      expect(service.getUserName()).toBe('João Silva');
    });

    it('deve retornar null para todos os campos quando não há token', () => {
      sessionStorage.clear();
      expect(service.getUserId()).toBeNull();
      expect(service.getUserEmail()).toBeNull();
      expect(service.getUserName()).toBeNull();
    });
  });

  describe('loginUrl', () => {
    it('deve retornar a URL de login do ambiente', () => {
      expect(service.loginUrl).toBeDefined();
      expect(typeof service.loginUrl).toBe('string');
    });
  });
});
