import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoiceInputService } from '../../../core/services/voice-input.service';
import { VoiceInputBtnComponent } from './voice-input-btn.component';

function makeVoiceInputServiceMock(supported = true) {
  return {
    supported,
    audioLevel: signal(0),
    listen: vi.fn().mockResolvedValue('texto de teste'),
    stop: vi.fn(),
  };
}

describe('VoiceInputBtnComponent', () => {
  let fixture: ComponentFixture<VoiceInputBtnComponent>;
  let component: VoiceInputBtnComponent;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let voiceMock: ReturnType<typeof makeVoiceInputServiceMock>;

  beforeEach(async () => {
    voiceMock = makeVoiceInputServiceMock();

    await TestBed.configureTestingModule({
      imports: [VoiceInputBtnComponent],
      providers: [{ provide: VoiceInputService, useValue: voiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(VoiceInputBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => vi.restoreAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows mic button (idle state) when not listening', () => {
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn).not.toBeNull();
    expect(btn.getAttribute('aria-label')).toBe('Usar voz para preencher');
  });

  it('renders no button when voice is not supported', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [VoiceInputBtnComponent],
      providers: [{ provide: VoiceInputService, useValue: makeVoiceInputServiceMock(false) }],
    }).compileComponents();

    const f = TestBed.createComponent(VoiceInputBtnComponent);
    f.detectChanges();

    expect(f.nativeElement.querySelector('button')).toBeNull();
  });

  it('shows stop button (listening state) while recognition is in progress', async () => {
    voiceMock.listen.mockReturnValue(new Promise(() => {}));

    component.start();
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.getAttribute('aria-label')).toBe('Parar gravação');

    component.stop();
  });

  it('emits result with transcribed text on success', async () => {
    const results: string[] = [];
    component.result.subscribe((v) => results.push(v));

    await component.start();

    expect(results).toEqual(['texto de teste']);
  });

  it('does not emit result when transcribed text is blank', async () => {
    voiceMock.listen.mockResolvedValue('   ');
    const results: string[] = [];
    component.result.subscribe((v) => results.push(v));

    await component.start();

    expect(results).toHaveLength(0);
  });

  it('emits mic-denied message on not-allowed error', async () => {
    voiceMock.listen.mockRejectedValue('not-allowed');
    const errors: string[] = [];
    component.errorMsg.subscribe((v) => errors.push(v));

    await component.start();

    expect(errors).toEqual([
      'Permissão de microfone negada. Habilite nas configurações do navegador.',
    ]);
  });

  it('emits generic error message on other errors', async () => {
    voiceMock.listen.mockRejectedValue('audio-capture');
    const errors: string[] = [];
    component.errorMsg.subscribe((v) => errors.push(v));

    await component.start();

    expect(errors).toEqual(['Não foi possível capturar o áudio. Tente novamente.']);
  });

  it('stop() calls voice.stop()', () => {
    component.stop();
    expect(voiceMock.stop).toHaveBeenCalled();
  });

  it('volumePct() returns minimum 10 when audioLevel is 0', () => {
    voiceMock.audioLevel.set(0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((component as any).volumePct()).toBe(10);
  });

  it('volumePct() returns actual audioLevel when above 10', () => {
    voiceMock.audioLevel.set(75);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((component as any).volumePct()).toBe(75);
  });
});
