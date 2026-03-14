import { inject, Injectable, signal } from '@angular/core';
import { AccessibilityService } from './accessibility.service';

@Injectable({ providedIn: 'root' })
export class VoiceReadingService {
  private readonly a11y = inject(AccessibilityService);
  private readonly synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  readonly speaking = signal(false);

  get supported(): boolean {
    return !!this.synth;
  }

  speak(text: string): void {
    if (!this.synth) return;
    if (!this.a11y.voiceReading()) return;
    this.stop();
    this._utter(text.trim(), this.a11y.speechRate());
  }

  speakDirect(text: string, rate = this.a11y.speechRate()): void {
    if (!this.synth) return;
    this.stop();
    this._utter(text.trim(), rate);
  }

  stop(): void {
    this.synth?.cancel();
    this.speaking.set(false);
  }

  private _utter(text: string, rate: number): void {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = this.synth!.getVoices();
    const ptVoice = voices.find((v) => v.lang.startsWith('pt'));
    if (ptVoice) utterance.voice = ptVoice;

    utterance.onstart = () => this.speaking.set(true);
    utterance.onend = () => this.speaking.set(false);
    utterance.onerror = () => this.speaking.set(false);

    this.synth!.speak(utterance);
  }
}
