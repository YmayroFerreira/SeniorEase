import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AgendaListComponent,
  BadgeComponent,
  HeaderComponent,
  HeroCardComponent,
  IconComponent,
  MaterialsListComponent,
  StatsGridComponent,
  TextComponent,
} from '@senior-ease/ui';
import { AccessibilityService } from '../../core/services/accessibility.service';

@Component({
  selector: 'app-dashboard-ds',
  standalone: true,
  imports: [
    CommonModule,
    BadgeComponent,
    HeaderComponent,
    HeroCardComponent,
    IconComponent,
    StatsGridComponent,
    AgendaListComponent,
    MaterialsListComponent,
    TextComponent,
  ],
  templateUrl: './dashboard-ds.component.html',
  styleUrls: ['./dashboard-ds.component.scss'],
})
export class DashboardDSComponent {
  protected readonly accessibility = inject(AccessibilityService);

  protected readonly today = new Date();

  protected readonly stats = [
    {
      label: 'Aulas Concluídas',
      value: '3 de 10',
      description: 'Módulo: Primeiros Passos no HTML',
      tone: 'primary' as const,
    },
    {
      label: 'Trabalhos Entregues',
      value: '1 de 1',
      description: 'Trabalho Final entregue com sucesso',
      tone: 'success' as const,
    },
    {
      label: 'Próxima Aula',
      value: '19:00',
      description: 'Desenvolvimento Front End',
      tone: 'warning' as const,
    },
  ];

  protected readonly agendaItems = [
    {
      title: 'Aula de Desenvolvimento Front End',
      description: 'Prof. Dr. Carlos Mendes • Sala virtual 03',
      meta: '19:00 – 21:00',
      badgeLabel: 'Hoje',
      badgeVariant: 'warning' as const,
      icon: 'calendar' as const,
    },
    {
      title: 'Fórum: Hackathon',
      description: '3 novas mensagens aguardando resposta',
      meta: '',
      badgeLabel: '3 novas',
      badgeVariant: 'primary' as const,
      icon: 'message' as const,
    },
    {
      title: 'Registro de Mentoria Pendente',
      description: 'Você não registrou a mentoria de ontem',
      meta: '',
      badgeLabel: 'Pendente',
      badgeVariant: 'danger' as const,
      icon: 'clock' as const,
    },
  ];

  protected readonly materialsItems = [
    {
      title: 'Meu Caderno',
      description: 'Suas lições e anotações salvas',
      icon: 'book' as const,
    },
    {
      title: 'Material da Aula 04',
      description: 'Slides e exercícios de HTML',
      icon: 'book' as const,
    },
    {
      title: 'Guia de Referência CSS',
      description: 'Propriedades e exemplos práticos',
      icon: 'book' as const,
    },
  ];
}
