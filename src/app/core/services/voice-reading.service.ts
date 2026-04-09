import { effect, inject, Injectable, signal } from '@angular/core';
import { AccessibilityService } from './accessibility.service';

@Injectable({ providedIn: 'root' })
export class VoiceReadingService {
  private readonly a11y = inject(AccessibilityService);
  private readonly synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  readonly speaking = signal(false);

  private readonly _ = effect(() => {
    if (!this.a11y.voiceReading()) {
      this.stop();
    }
  });

  get supported(): boolean {
    return !!this.synth;
  }

  speak(text: string): void {
    if (!this.synth) return;
    if (!this.a11y.voiceReading()) return;
    if (this.a11y.silentMode()) return;
    const trimmed = text.trim();
    if (!trimmed) return;
    this.stop();
    // Delay necessário para o Chrome não ignorar o speak() logo após cancel()
    setTimeout(() => this._utter(trimmed, this.a11y.speechRate()), 50);
  }

  speakDirect(text: string, rate = this.a11y.speechRate()): void {
    if (!this.synth) return;
    if (this.a11y.silentMode()) return;
    const trimmed = text.trim();
    if (!trimmed) return;
    this.stop();
    setTimeout(() => this._utter(trimmed, rate), 50);
  }

  stop(): void {
    this.synth?.cancel();
    this.speaking.set(false);
  }

  private _utter(text: string, rate: number): void {
    if (!this.synth) return;

    // Chrome bug: síntese pode ficar travada em estado pausado
    if (this.synth.paused) {
      this.synth.resume();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => this.speaking.set(true);
    utterance.onend = () => this.speaking.set(false);
    utterance.onerror = () => this.speaking.set(false);

    const voices = this.synth.getVoices();
    if (voices.length > 0) {
      const ptVoice = voices.find((v) => v.lang.startsWith('pt'));
      if (ptVoice) utterance.voice = ptVoice;
      this.synth.speak(utterance);
    } else {
      // Vozes ainda não carregadas — aguarda o evento voiceschanged
      this.synth.addEventListener(
        'voiceschanged',
        () => {
          const loadedVoices = this.synth!.getVoices();
          const ptVoice = loadedVoices.find((v) => v.lang.startsWith('pt'));
          if (ptVoice) utterance.voice = ptVoice;
          this.synth!.speak(utterance);
        },
        { once: true },
      );
    }
  }
}
