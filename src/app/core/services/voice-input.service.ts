import { inject, Injectable, NgZone, signal } from '@angular/core';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

function getSpeechRecognition(): (new () => Any) | null {
  if (typeof window === 'undefined') return null;
  const w = window as Any;
  return w['SpeechRecognition'] ?? w['webkitSpeechRecognition'] ?? null;
}

@Injectable({ providedIn: 'root' })
export class VoiceInputService {
  private Recognition = getSpeechRecognition();
  private ngZone = inject(NgZone);

  readonly supported = !!this.Recognition;

  /** 0–100: real-time volume from Web Audio API (0 when not listening) */
  audioLevel = signal<number>(0);

  private current: Any = null;
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private rafId: number | null = null;

  /**
   * Starts voice recognition.
   * 1. Opens getUserMedia to feed AnalyserNode (volume meter)
   * 2. Then starts SpeechRecognition against the same mic
   * Returns the transcribed text, or '' if no speech detected.
   */
  async listen(): Promise<string> {
    if (!this.Recognition) return Promise.reject('not-supported');

    await this.startAudioMeter();

    return new Promise<string>((resolve, reject) => {
      const recognition = new this.Recognition!();
      this.current = recognition;

      let settled = false;

      recognition.lang = 'pt-BR';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: Any) => {
        const transcript = (event.results[0][0].transcript as string).trim();
        this.ngZone.run(() => {
          if (settled) return;
          settled = true;
          this.cleanup();
          resolve(transcript);
        });
      };

      recognition.onerror = (event: Any) => {
        this.ngZone.run(() => {
          if (settled) return;
          settled = true;
          const err = event?.error ?? 'unknown';
          this.cleanup();
          const benign = ['no-speech', 'aborted'];
          if (benign.includes(err)) {
            resolve('');
          } else {
            reject(err);
          }
        });
      };

      recognition.onend = () => {
        this.ngZone.run(() => {
          this.cleanup();
          if (settled) return;
          settled = true;
          resolve('');
        });
      };

      recognition.start();
    });
  }

  stop(): void {
    this.current?.stop();
    this.current = null;
    this.cleanup();
  }

  private async startAudioMeter(): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.mediaStream = stream;
      this.audioCtx = new AudioContext();
      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }
      const source = this.audioCtx.createMediaStreamSource(stream);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.5;
      source.connect(this.analyser);
      this.pollLevel();
    } catch {
      // Mic unavailable — bars keep minimum height, recognition still works
    }
  }

  private pollLevel(): void {
    if (!this.analyser) return;
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    // Voice frequency bands (fftSize=256 → 128 bins; bands 2–18 ≈ 86Hz–3kHz)
    const voice = Array.from(data.slice(2, 18));
    const avg = voice.reduce((a, b) => a + b, 0) / voice.length;
    this.audioLevel.set(Math.min(100, Math.round((avg / 255) * 100)));
    this.rafId = requestAnimationFrame(() => this.pollLevel());
  }

  private cleanup(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.analyser = null;
    this.mediaStream?.getTracks().forEach((t) => t.stop());
    this.mediaStream = null;
    this.audioCtx?.close().catch(() => {});
    this.audioCtx = null;
    this.audioLevel.set(0);
  }
}
