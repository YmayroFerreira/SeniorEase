import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faBookOpen,
  faChevronRight,
  faTrash,
  faTriangleExclamation,
  faVolumeUp,
} from '@fortawesome/free-solid-svg-icons';
import { AccessibilityService } from '../../core/services/accessibility.service';
import { VoiceInputService } from '../../core/services/voice-input.service';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { VoiceReadDirective } from '../../shared/directives/voice-read.directive';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

@Component({
  selector: 'app-notebook',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, VoiceReadDirective, BreadcrumbComponent],
  templateUrl: './notebook.component.html',
})
export class NotebookComponent implements OnInit {
  protected readonly accessibility = inject(AccessibilityService);
  protected readonly router = inject(Router);
  private readonly location = inject(Location);
  protected readonly voiceInput = inject(VoiceInputService);

  protected readonly fromWizard = !!localStorage.getItem('wizard-session');

  protected goBack(): void {
    this.location.back();
  }

  protected savedNotes: Note[] = [];
  protected readonly confirmModal = signal<{ id: string; title: string } | null>(null);
  protected readonly icons = {
    arrowLeft: faArrowLeft,
    chevronRight: faChevronRight,
    book: faBookOpen,
    volume: faVolumeUp,
    trash: faTrash,
    warning: faTriangleExclamation,
  };

  ngOnInit() {
    this.loadNotes();
  }

  private loadNotes() {
    this.savedNotes = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('notes_lesson_')) {
        const content = localStorage.getItem(key);
        if (content) {
          this.savedNotes.push({
            id: key,
            title: 'Desenvolvimento Front End',
            content: content,
            date: new Date().toISOString(),
          });
        }
      }
    }
  }

  protected requestDelete(id: string, title: string): void {
    if (this.accessibility.extraConfirmations()) {
      this.confirmModal.set({ id, title });
    } else {
      this.executeDelete(id);
    }
  }

  protected confirmDelete(): void {
    const modal = this.confirmModal();
    if (modal) {
      this.executeDelete(modal.id);
      this.confirmModal.set(null);
    }
  }

  protected cancelDelete(): void {
    this.confirmModal.set(null);
  }

  private executeDelete(id: string): void {
    localStorage.removeItem(id);
    this.loadNotes();
  }
}
