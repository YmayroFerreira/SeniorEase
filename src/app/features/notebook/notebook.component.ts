import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faBookOpen, faTrash, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { AccessibilityService } from '../../core/services/accessibility.service';
import { VoiceInputService } from '../../core/services/voice-input.service';
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
  imports: [CommonModule, FontAwesomeModule, VoiceReadDirective],
  templateUrl: './notebook.component.html',
})
export class NotebookComponent implements OnInit {
  protected readonly accessibility = inject(AccessibilityService);
  protected readonly router = inject(Router);
  protected readonly voiceInput = inject(VoiceInputService);

  protected savedNotes: Note[] = [];
  protected readonly icons = {
    arrowLeft: faArrowLeft,
    book: faBookOpen,
    volume: faVolumeUp,
    trash: faTrash,
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

  protected deleteNote(id: string) {
    if (confirm('Deseja apagar esta anotação para sempre?')) {
      localStorage.removeItem(id);
      this.loadNotes();
    }
  }
}
