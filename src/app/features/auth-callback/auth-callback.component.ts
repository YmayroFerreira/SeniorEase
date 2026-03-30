import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

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

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      this.authService.storeToken(token);
      if (this.authService.isTokenValid()) {
        this.router.navigate(['/inicio'], { replaceUrl: true });
        return;
      }
    }

    this.authService.clearToken();
    window.location.href = this.authService.loginUrl;
  }
}
