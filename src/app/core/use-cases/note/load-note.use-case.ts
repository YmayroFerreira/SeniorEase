import { inject, Injectable } from '@angular/core';
import { NoteEntity } from '../../domain/entities/note.entity';
import { NOTE_REPOSITORY } from '../../domain/repositories/note.repository';

@Injectable({ providedIn: 'root' })
export class LoadNoteUseCase {
  private readonly repo = inject(NOTE_REPOSITORY);

  execute(lessonId: string): NoteEntity | null {
    return this.repo.findByLessonId(lessonId);
  }
}
