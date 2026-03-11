import { Directive, ElementRef, HostBinding, HostListener, inject, Input } from '@angular/core';
import { AccessibilityService } from '../../core/services/accessibility.service';
import { VoiceReadingService } from '../../core/services/voice-reading.service';

@Directive({
  selector: '[appVoiceRead]',
  standalone: true,
})
export class VoiceReadDirective {
  @Input('appVoiceRead') text = '';

  private readonly accessibilityService = inject(AccessibilityService);
  private readonly voiceReadingService = inject(VoiceReadingService);
  private readonly el = inject(ElementRef);

  @HostBinding('class.voice-read-active')
  get isActive(): boolean {
    return this.accessibilityService.voiceReading();
  }

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    if (!this.accessibilityService.voiceReading()) return;
    event.stopPropagation();
    const content = this.text || (this.el.nativeElement as HTMLElement).textContent || '';
    this.voiceReadingService.speak(content);
  }
}
