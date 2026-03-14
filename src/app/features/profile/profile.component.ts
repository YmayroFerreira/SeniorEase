import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VoiceReadDirective } from '../../shared/directives/voice-read.directive';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, VoiceReadDirective],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {}
