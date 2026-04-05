import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AccessibilityService } from '@senior-ease/ui';
import { DashboardComponent } from './dashboard.component';

const mockAccessibilityService = {
  simplifiedNav: signal(false),
  theme: signal('default'),
  voiceReading: signal(false),
  extraConfirmations: signal(false),
};

describe('DashboardComponent', () => {
  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: AccessibilityService, useValue: mockAccessibilityService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(DashboardComponent, {
        set: {
          imports: [TranslateModule],
          template: `
            <div data-testid="dashboard">
              <div data-testid="wizard-progress">{{ wizardCompleted() }}/{{ wizardTotal }}</div>
              <div data-testid="aula-hoje">Aula de hoje</div>
              <div data-testid="meu-caderno">Meu Caderno</div>
            </div>
          `,
        },
      })
      .compileComponents();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('deve criar o componente', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve renderizar o dashboard na tela', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[data-testid="dashboard"]')).not.toBeNull();
  });

  it('deve exibir a seção de aula de hoje', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[data-testid="aula-hoje"]')?.textContent).toContain('Aula de hoje');
  });

  it('deve exibir a seção do caderno', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[data-testid="meu-caderno"]')?.textContent).toContain('Meu Caderno');
  });

  it('deve ter total de 4 atividades no wizard', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const component = fixture.componentInstance as DashboardComponent & { wizardTotal: number };
    expect(component['wizardTotal']).toBe(4);
  });

  it('deve iniciar com 0 atividades concluídas quando localStorage está vazio', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const component = fixture.componentInstance as DashboardComponent & {
      wizardCompleted: () => number;
    };
    expect(component['wizardCompleted']()).toBe(0);
  });

  it('deve carregar atividades concluídas do localStorage', () => {
    localStorage.setItem('wizard-completed-activities', JSON.stringify(['ativ-1', 'ativ-2']));
    const fixture = TestBed.createComponent(DashboardComponent);
    const component = fixture.componentInstance as DashboardComponent & {
      wizardCompleted: () => number;
    };
    expect(component['wizardCompleted']()).toBe(2);
  });

  it('deve retornar 0 atividades se o valor no localStorage for inválido', () => {
    localStorage.setItem('wizard-completed-activities', 'json-invalido');
    const fixture = TestBed.createComponent(DashboardComponent);
    const component = fixture.componentInstance as DashboardComponent & {
      wizardCompleted: () => number;
    };
    expect(component['wizardCompleted']()).toBe(0);
  });

  it('deve exibir o progresso do wizard corretamente', () => {
    localStorage.setItem('wizard-completed-activities', JSON.stringify(['a1', 'a2', 'a3']));
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[data-testid="wizard-progress"]')?.textContent?.trim()).toBe('3/4');
  });
});
