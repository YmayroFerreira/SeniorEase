import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AccessibilityService } from '../../core/services/accessibility.service';
import { VoiceReadDirective } from '../../shared/directives/voice-read.directive';

@Component({
  selector: 'app-video-session',
  standalone: true,
  imports: [CommonModule, VoiceReadDirective],
  templateUrl: './video-session.component.html',
  styleUrls: ['./video-session.component.scss'],
})
export class VideoSessionComponent {
  protected readonly accessibility = inject(AccessibilityService);
  protected readonly router = inject(Router);

  protected isMuted = false;
  protected readonly isOnline = true;

  protected toggleMute() {
    this.isMuted = !this.isMuted;
  }
}
