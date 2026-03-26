import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faMicrophone,
  faMicrophoneSlash,
  faSignOutAlt,
  faVideoSlash,
  faVolumeMute,
  faVolumeUp,
} from '@fortawesome/free-solid-svg-icons';
import { faVideo } from '@fortawesome/free-solid-svg-icons/faVideo';
import { debounceTime, Subject } from 'rxjs';
import { AccessibilityService } from '../../core/services/accessibility.service';
import { StorageService } from '../../core/services/storage.service';
import { VoiceInputService } from '../../core/services/voice-input.service';
import { VoiceInputBtnComponent } from '../../shared/components/voice-input-btn/voice-input-btn.component';
import { VoiceReadDirective } from '../../shared/directives/voice-read.directive';
import { VideoSessionComponent } from '../video-session/video-session.component';

@Component({
  selector: 'app-active-lesson-session',
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    VoiceReadDirective,
    VoiceInputBtnComponent,
    VideoSessionComponent,
  ],
  templateUrl: './active-lesson-session.component.html',
  styleUrls: ['./active-lesson-session.component.scss'],
})
export class ActiveLessonSessionComponent implements OnInit {
  protected readonly accessibility = inject(AccessibilityService);
  protected readonly router = inject(Router);
  protected readonly voiceInput = inject(VoiceInputService);
  private readonly storage = inject(StorageService);

  protected readonly icons = {
    volumeUp: faVolumeUp,
    volumeMute: faVolumeMute,
    signOut: faSignOutAlt,
    arrowLeft: faArrowLeft,
    video: faVideo,
    videoSlash: faVideoSlash,
    mic: faMicrophone,
    micSlash: faMicrophoneSlash,
  };

  protected isMicMuted = false;
  protected isSpeakerMuted = false;
  protected isVideoOff = false;
  protected notes = '';
  protected testText = '';
  protected errorText = '';
  protected transcriptionEnabled = signal(false);

  private readonly lessonId = 'front-end-101'; // ID único da aula atual
  private notesUpdateSubject = new Subject<string>();

  ngOnInit() {
    this.notes = this.storage.getNotes(this.lessonId);
    this.notesUpdateSubject.pipe(debounceTime(1000)).subscribe((content) => {
      this.storage.saveNotes(this.lessonId, content);
      console.log('Anotação salva com segurança!');
    });
  }

  protected onNotesChange() {
    this.notesUpdateSubject.next(this.notes);
  }

  protected appendVoiceNote(text: string) {
    if (text) {
      this.notes = (this.notes ? this.notes + ' ' : '') + text;
      this.onNotesChange();
    }
  }

  protected toggleMuteSpeaker() {
    this.isSpeakerMuted = !this.isSpeakerMuted;
  }

  protected toggleMuteMic() {
    this.isMicMuted = !this.isMicMuted;
  }

  protected toggleTurnOffVideo() {
    this.isVideoOff = !this.isVideoOff;
  }
}
