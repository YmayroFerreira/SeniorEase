import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faChevronRight,
  faMicrophone,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import { AccessibilityService } from '../../core/services/accessibility.service';
import { VoiceInputService } from '../../core/services/voice-input.service';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { VoiceInputBtnComponent } from '../../shared/components/voice-input-btn/voice-input-btn.component';
import { VoiceReadDirective } from '../../shared/directives/voice-read.directive';

interface Message {
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
  isProfessor?: boolean;
}

@Component({
  selector: 'app-forum-chat',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    VoiceReadDirective,
    VoiceInputBtnComponent,
    FormsModule,
    BreadcrumbComponent,
  ],
  templateUrl: './forum-chat.component.html',
})
export class ForumChatComponent {
  protected readonly icons = {
    send: faPaperPlane,
    mic: faMicrophone,
    back: faArrowLeft,
    chevronRight: faChevronRight,
  };
  protected readonly router = inject(Router);
  private readonly location = inject(Location);
  protected readonly accessibility = inject(AccessibilityService);
  protected readonly voiceInput = inject(VoiceInputService);

  protected readonly fromWizard = !!localStorage.getItem('wizard-session');

  protected goBack(): void {
    this.location.back();
  }

  protected messages: Message[] = [
    {
      sender: 'Prof. Carlos',
      text: 'Olá turma! Alguma dúvida sobre o Hackathon?',
      time: '10:00',
      isMe: false,
      isProfessor: true,
    },
    {
      sender: 'Dona Maria',
      text: 'Professor, onde eu submeto o arquivo final?',
      time: '10:05',
      isMe: false,
    },
    {
      sender: 'Sr. Arnaldo (Você)',
      text: 'Eu já consegui entregar o meu!',
      time: '10:15',
      isMe: true,
    },
  ];

  protected newMessage = '';

  protected sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({
        sender: 'Sr. Arnaldo (Você)',
        text: this.newMessage,
        time: 'Agora',
        isMe: true,
      });
      this.newMessage = '';
    }
  }
}
