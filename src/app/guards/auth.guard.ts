import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);

  if (authService.isTokenValid()) return true;

  authService.clearToken();
  window.location.href = authService.loginUrl;
  return false;
};
