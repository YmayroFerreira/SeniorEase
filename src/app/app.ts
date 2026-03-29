import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccessibilityService } from '@senior-ease/ui';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App {
  private readonly _ = inject(AccessibilityService);
}
