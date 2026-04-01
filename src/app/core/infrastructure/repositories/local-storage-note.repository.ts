import { Injectable } from '@angular/core';
import { NoteEntity } from '../../domain/entities/note.entity';
import { INoteRepository } from '../../domain/repositories/note.repository';

@Injectable()
export class LocalStorageNoteRepository implements INoteRepository {
  private key(lessonId: string): string {
    return `notes_lesson_${lessonId}`;
  }

  findByLessonId(lessonId: string): NoteEntity | null {
    const content = localStorage.getItem(this.key(lessonId));
    if (content === null) return null;
    return { lessonId, content, updatedAt: new Date().toISOString() };
  }

  save(note: NoteEntity): void {
    localStorage.setItem(this.key(note.lessonId), note.content);
  }

  delete(lessonId: string): void {
    localStorage.removeItem(this.key(lessonId));
  }
}
