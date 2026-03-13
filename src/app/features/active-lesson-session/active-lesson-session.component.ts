import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSignOutAlt, faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { AccessibilityService } from '../../core/services/accessibility.service';
import { VoiceInputService } from '../../core/services/voice-input.service';
import { VoiceInputBtnComponent } from '../../shared/components/voice-input-btn/voice-input-btn.component';
import { VoiceReadDirective } from '../../shared/directives/voice-read.directive';
import { VideoSessionComponent } from '../video-session/video-session.component';

@Component({
  selector: 'app-active-lesson-session',
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    VoiceReadDirective,
    VoiceInputBtnComponent,
    VideoSessionComponent,
  ],
  templateUrl: './active-lesson-session.component.html',
})
export class ActiveLessonSessionComponent {
  protected readonly accessibility = inject(AccessibilityService);
  protected readonly router = inject(Router);
  protected readonly voiceInput = inject(VoiceInputService);

  protected readonly icons = {
    volumeUp: faVolumeUp,
    volumeMute: faVolumeMute,
    signOut: faSignOutAlt,
  };

  protected isMuted = false;
  protected notes = '';
  protected testText = '';
  protected errorText = '';
  protected transcriptionEnabled = signal(false);

  protected toggleMute() {
    this.isMuted = !this.isMuted;
  }

  protected appendVoiceNote(text: string) {
    this.notes = (this.notes ? this.notes + ' ' : '') + text;
  }
}
