import { inject, Injectable } from '@angular/core';
import { NOTE_REPOSITORY } from '../domain/repositories/note.repository';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly noteRepo = inject(NOTE_REPOSITORY);

  saveNotes(lessonId: string, content: string): void {
    this.noteRepo.save({ lessonId, content, updatedAt: new Date().toISOString() });
  }

  getNotes(lessonId: string): string {
    return this.noteRepo.findByLessonId(lessonId)?.content ?? '';
  }

  clearNotes(lessonId: string): void {
    this.noteRepo.delete(lessonId);
  }
}
