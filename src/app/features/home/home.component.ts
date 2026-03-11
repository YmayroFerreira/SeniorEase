import { Component } from '@angular/core';
import { VoiceReadDirective } from '../../shared/directives/voice-read.directive';

@Component({
  selector: 'app-home',
  imports: [VoiceReadDirective],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
