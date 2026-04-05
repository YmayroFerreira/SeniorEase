import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AccessibilityService } from '@senior-ease/ui';
import { VoiceInputService } from '../../core/services/voice-input.service';
import { NotebookComponent } from './notebook.component';

const mockAccessibilityService = {
  simplifiedNav: signal(false),
  theme: signal('default'),
  voiceReading: signal(false),
  extraConfirmations: signal(false),
};

const mockVoiceInputService = {
  supported: true,
  audioLevel: signal(0),
  listen: vi.fn().mockResolvedValue(''),
  stop: vi.fn(),
};

const mockLocation = {
  back: vi.fn(),
};

describe('NotebookComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [NotebookComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: AccessibilityService, useValue: mockAccessibilityService },
        { provide: VoiceInputService, useValue: mockVoiceInputService },
        { provide: Location, useValue: mockLocation },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(NotebookComponent, {
        set: {
          imports: [TranslateModule],
          template: `
            <div data-testid="caderno">
              <h1 data-testid="titulo">Meu Caderno</h1>
              <div data-testid="lista-notas">
                @for (note of savedNotes; track note.id) {
                  <div [attr.data-note-id]="note.id" data-testid="item-nota">{{ note.title }}</div>
                }
              </div>
              @if (confirmModal()) {
                <div data-testid="modal-confirmacao">
                  Confirmar exclusão?
                  <button data-testid="btn-confirmar" (click)="confirmDelete()">Confirmar</button>
                  <button data-testid="btn-cancelar" (click)="cancelDelete()">Cancelar</button>
                </div>
              }
            </div>
          `,
        },
      })
      .compileComponents();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('deve criar o componente', () => {
    const fixture = TestBed.createComponent(NotebookComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve renderizar o caderno na tela', () => {
    const fixture = TestBed.createComponent(NotebookComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[data-testid="caderno"]')).not.toBeNull();
  });

  it('deve exibir o título do caderno', () => {
    const fixture = TestBed.createComponent(NotebookComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[data-testid="titulo"]')?.textContent).toContain('Meu Caderno');
  });

  it('deve iniciar com lista de notas vazia quando localStorage está limpo', () => {
    const fixture = TestBed.createComponent(NotebookComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance as NotebookComponent;
    expect(component['savedNotes']).toHaveLength(0);
  });

  it('deve carregar notas existentes do localStorage ao inicializar', () => {
    localStorage.setItem('notes_lesson_1', 'Conteúdo da aula 1');
    localStorage.setItem('notes_lesson_2', 'Conteúdo da aula 2');

    const fixture = TestBed.createComponent(NotebookComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance as NotebookComponent;

    expect(component['savedNotes']).toHaveLength(2);
  });

  it('não deve carregar chaves que não sejam prefixadas com notes_lesson_', () => {
    localStorage.setItem('notes_lesson_1', 'Nota válida');
    localStorage.setItem('outra-chave', 'Valor ignorado');
    localStorage.setItem('profile-name', 'João');

    const fixture = TestBed.createComponent(NotebookComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance as NotebookComponent;

    expect(component['savedNotes']).toHaveLength(1);
  });

  describe('requestDelete', () => {
    it('deve executar a exclusão diretamente quando extraConfirmations está desativado', () => {
      localStorage.setItem('notes_lesson_abc', 'Nota para deletar');
      mockAccessibilityService.extraConfirmations = signal(false);

      const fixture = TestBed.createComponent(NotebookComponent);
      fixture.detectChanges();
      const component = fixture.componentInstance as NotebookComponent;

      component['requestDelete']('notes_lesson_abc', 'Aula ABC');

      expect(component['savedNotes'].find((n) => n.id === 'notes_lesson_abc')).toBeUndefined();
    });

    it('deve abrir o modal de confirmação quando extraConfirmations está ativado', () => {
      localStorage.setItem('notes_lesson_abc', 'Nota para deletar');
      mockAccessibilityService.extraConfirmations = signal(true);

      const fixture = TestBed.createComponent(NotebookComponent);
      fixture.detectChanges();
      const component = fixture.componentInstance as NotebookComponent;

      component['requestDelete']('notes_lesson_abc', 'Aula ABC');

      expect(component['confirmModal']()).not.toBeNull();
      expect(component['confirmModal']()?.id).toBe('notes_lesson_abc');
    });
  });

  describe('confirmDelete', () => {
    it('deve remover a nota e fechar o modal ao confirmar exclusão', () => {
      localStorage.setItem('notes_lesson_xyz', 'Nota para deletar');
      mockAccessibilityService.extraConfirmations = signal(true);

      const fixture = TestBed.createComponent(NotebookComponent);
      fixture.detectChanges();
      const component = fixture.componentInstance as NotebookComponent;

      component['requestDelete']('notes_lesson_xyz', 'Aula XYZ');
      component['confirmDelete']();

      expect(component['savedNotes'].find((n) => n.id === 'notes_lesson_xyz')).toBeUndefined();
      expect(component['confirmModal']()).toBeNull();
    });
  });

  describe('cancelDelete', () => {
    it('deve fechar o modal sem excluir a nota ao cancelar', () => {
      localStorage.setItem('notes_lesson_keep', 'Nota preservada');
      mockAccessibilityService.extraConfirmations = signal(true);

      const fixture = TestBed.createComponent(NotebookComponent);
      fixture.detectChanges();
      const component = fixture.componentInstance as NotebookComponent;

      component['requestDelete']('notes_lesson_keep', 'Aula Keep');
      component['cancelDelete']();

      expect(component['confirmModal']()).toBeNull();
      expect(component['savedNotes'].find((n) => n.id === 'notes_lesson_keep')).toBeDefined();
    });
  });

  describe('goBack', () => {
    it('deve chamar location.back() ao navegar de volta', () => {
      const fixture = TestBed.createComponent(NotebookComponent);
      const component = fixture.componentInstance as NotebookComponent;
      component['goBack']();
      expect(mockLocation.back).toHaveBeenCalledTimes(1);
    });
  });
});
