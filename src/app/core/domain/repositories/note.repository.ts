import { InjectionToken } from '@angular/core';
import { NoteEntity } from '../entities/note.entity';

export interface INoteRepository {
  findByLessonId(lessonId: string): NoteEntity | null;
  save(note: NoteEntity): void;
  delete(lessonId: string): void;
}

export const NOTE_REPOSITORY = new InjectionToken<INoteRepository>('INoteRepository');
