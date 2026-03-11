import { NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { VoiceInputService } from './voice-input.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

interface MockRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: Any) => void) | null;
  onerror: ((e: Any) => void) | null;
  onend: (() => void) | null;
  start: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
}

describe('VoiceInputService', () => {
  let service: VoiceInputService;
  let mockInstance: MockRecognitionInstance;

  beforeEach(() => {
    mockInstance = {
      lang: '',
      continuous: false,
      interimResults: false,
      maxAlternatives: 1,
      onresult: null,
      onerror: null,
      onend: null,
      start: vi.fn(),
      stop: vi.fn(),
    };

    const MockRecognitionClass = function (this: Any) {
      Object.assign(this, mockInstance);
      mockInstance = this as MockRecognitionInstance;
    };

    (window as Any)['SpeechRecognition'] = MockRecognitionClass;

    if (navigator.mediaDevices) {
      vi.spyOn(navigator.mediaDevices, 'getUserMedia').mockRejectedValue(
        new Error('no mic in test'),
      );
    }

    TestBed.configureTestingModule({});
    service = TestBed.inject(VoiceInputService);
  });

  afterEach(() => {
    delete (window as Any)['SpeechRecognition'];
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('supported is true when SpeechRecognition exists', () => {
    expect(service.supported).toBe(true);
  });

  it('audioLevel starts at 0', () => {
    expect(service.audioLevel()).toBe(0);
  });

  it('listen() configures recognition with pt-BR and calls start()', async () => {
    const promise = service.listen();
    await Promise.resolve();

    expect(mockInstance.lang).toBe('pt-BR');
    expect(mockInstance.continuous).toBe(false);
    expect(mockInstance.interimResults).toBe(false);
    expect(mockInstance.start).toHaveBeenCalled();

    TestBed.inject(NgZone).run(() => mockInstance.onend!());
    await promise;
  });

  it('listen() resolves with trimmed transcript on result', async () => {
    const promise = service.listen();
    await Promise.resolve();

    TestBed.inject(NgZone).run(() => {
      mockInstance.onresult!({ results: [[{ transcript: '  olá mundo  ' }]] });
    });

    expect(await promise).toBe('olá mundo');
  });

  it('listen() resolves with empty string on no-speech error', async () => {
    const promise = service.listen();
    await Promise.resolve();

    TestBed.inject(NgZone).run(() => {
      mockInstance.onerror!({ error: 'no-speech' });
    });

    expect(await promise).toBe('');
  });

  it('listen() resolves with empty string on aborted error', async () => {
    const promise = service.listen();
    await Promise.resolve();

    TestBed.inject(NgZone).run(() => {
      mockInstance.onerror!({ error: 'aborted' });
    });

    expect(await promise).toBe('');
  });

  it('listen() rejects with error code on non-benign error', async () => {
    const promise = service.listen();
    await Promise.resolve();

    TestBed.inject(NgZone).run(() => {
      mockInstance.onerror!({ error: 'not-allowed' });
    });

    await expect(promise).rejects.toBe('not-allowed');
  });

  it('listen() resolves with empty string when onend fires without result', async () => {
    const promise = service.listen();
    await Promise.resolve();

    TestBed.inject(NgZone).run(() => mockInstance.onend!());

    expect(await promise).toBe('');
  });

  it('stop() calls recognition.stop() and resets audioLevel to 0', async () => {
    service.listen();
    await Promise.resolve();

    service.stop();

    expect(mockInstance.stop).toHaveBeenCalled();
    expect(service.audioLevel()).toBe(0);
  });
});
