import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  saveNotes(lessonId: string, content: string): void {
    const key = `notes_lesson_${lessonId}`;
    localStorage.setItem(key, content);
  }

  getNotes(lessonId: string): string {
    const key = `notes_lesson_${lessonId}`;
    return localStorage.getItem(key) || '';
  }

  clearNotes(lessonId: string): void {
    localStorage.removeItem(`notes_lesson_${lessonId}`);
  }
}
