import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { VoiceInputService } from '../../../core/services/voice-input.service';

@Component({
  selector: 'app-voice-input-btn',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    @if (voice.supported) {
      @if (isListening()) {
        <button
          type="button"
          class="flex items-center justify-center rounded-xl border-2 border-success bg-success-light cursor-pointer flex-shrink-0"
          style="width: 44px; height: 44px"
          (click)="stop()"
          aria-label="Parar gravação"
          title="Gravando... clique para parar"
        >
          <div
            class="relative bg-white/60 rounded-full overflow-hidden flex-shrink-0"
            style="width: 10px; height: 30px"
          >
            <div
              class="absolute bottom-0 left-0 right-0 rounded-full bg-success"
              style="transition: height 80ms ease-out"
              [style.height.%]="volumePct()"
            ></div>
          </div>
        </button>
      } @else {
        <button
          type="button"
          class="bg-card border border-border rounded-xl flex items-center justify-center cursor-pointer hover:bg-primary-surface transition-colors flex-shrink-0"
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
