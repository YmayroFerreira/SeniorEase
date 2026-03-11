import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VoiceInputService } from '../../core/services/voice-input.service';
import { VoiceInputBtnComponent } from '../../shared/components/voice-input-btn/voice-input-btn.component';
import { VoiceReadDirective } from '../../shared/directives/voice-read.directive';

@Component({
  selector: 'app-home',
  imports: [FormsModule, VoiceReadDirective, VoiceInputBtnComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  protected readonly voiceInput = inject(VoiceInputService);
  protected testText = '';
  protected errorText = '';
  protected transcriptionEnabled = signal(false);
}
