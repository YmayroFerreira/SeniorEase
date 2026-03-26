import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { AccessibilityService } from '../../../core/services/accessibility.service';
import { VoiceInputService } from '../../../core/services/voice-input.service';

@Component({
  selector: 'app-voice-input-btn',
  standalone: true,
  imports: [FontAwesomeModule, NgClass],
  template: `
    @if (voice.supported) {
      @if (isListening()) {
        <button
          type="button"
          class="flex items-center justify-center rounded-xl border-2 cursor-pointer flex-shrink-0"
          [ngClass]="
            accessibility.theme() === 'high-contrast'
              ? 'border-primary-light bg-black'
              : 'border-success bg-success-light'
          "
          style="width: 44px; height: 44px"
          (click)="stop()"
          aria-label="Parar gravação"
          title="Gravando... clique para parar"
        >
          <div
            class="relative rounded-full overflow-hidden flex-shrink-0"
            [ngClass]="
              accessibility.theme() === 'high-contrast'
                ? 'border border-primary-light'
                : 'bg-white/60'
            "
            style="width: 10px; height: 30px"
          >
            <div
              class="absolute bottom-0 left-0 right-0 rounded-full"
              [ngClass]="
                accessibility.theme() === 'high-contrast' ? 'bg-primary-light' : 'bg-success'
              "
              style="transition: height 80ms ease-out"
              [style.height.%]="volumePct()"
            ></div>
          </div>
        </button>
      } @else {
        <button
          type="button"
          class="rounded-xl border flex items-center justify-center cursor-pointer transition-colors flex-shrink-0"
          [ngClass]="
            accessibility.theme() === 'high-contrast'
              ? 'bg-black border-primary-light text-primary-light'
              : 'bg-card border-border hover:bg-primary-surface'
          "
          style="width: 44px; height: 44px; font-size: 20px"
          (click)="start()"
          aria-label="Usar voz para preencher"
          title="Preencher por voz"
        >
          <fa-icon [icon]="micIcon" style="font-size: 18px"></fa-icon>
        </button>
      }
    }
  `,
})
export class VoiceInputBtnComponent {
  @Output() result = new EventEmitter<string>();
  @Output() errorMsg = new EventEmitter<string>();

  protected voice = inject(VoiceInputService);
  protected accessibility = inject(AccessibilityService);
  protected readonly micIcon = faMicrophone;

  protected isListening = signal(false);

  protected volumePct(): number {
    return Math.max(10, this.voice.audioLevel());
  }

  async start(): Promise<void> {
    this.isListening.set(true);
    try {
      const text = await this.voice.listen();
      if (text.trim()) {
        this.result.emit(text.trim());
      }
    } catch (err) {
      const denied = typeof err === 'string' && err.includes('not-allowed');
      this.errorMsg.emit(
        denied
          ? 'Permissão de microfone negada. Habilite nas configurações do navegador.'
          : 'Não foi possível capturar o áudio. Tente novamente.',
      );
    } finally {
      this.isListening.set(false);
    }
  }

  stop(): void {
    this.voice.stop();
    this.isListening.set(false);
  }
}
