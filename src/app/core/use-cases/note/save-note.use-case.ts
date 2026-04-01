import { inject, Injectable } from '@angular/core';
import { NOTE_REPOSITORY } from '../../domain/repositories/note.repository';

@Injectable({ providedIn: 'root' })
export class SaveNoteUseCase {
  private readonly repo = inject(NOTE_REPOSITORY);

  execute(lessonId: string, content: string): void {
    this.repo.save({ lessonId, content, updatedAt: new Date().toISOString() });
  }
}
