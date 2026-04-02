import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import {
  ApplicationConfig,
  LOCALE_ID,
  inject,
  isDevMode,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideServiceWorker } from '@angular/service-worker';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { ACCESSIBILITY_PREFERENCES_REPOSITORY } from './core/domain/repositories/accessibility-preferences.repository';
import { ACTIVITY_SESSION_REPOSITORY } from './core/domain/repositories/activity-session.repository';
import { NOTE_REPOSITORY } from './core/domain/repositories/note.repository';
import { USER_REPOSITORY } from './core/domain/repositories/user.repository';
import { LocalStorageAccessibilityRepository } from './core/infrastructure/repositories/local-storage-accessibility.repository';
import { LocalStorageActivitySessionRepository } from './core/infrastructure/repositories/local-storage-activity-session.repository';
import { LocalStorageNoteRepository } from './core/infrastructure/repositories/local-storage-note.repository';
import { LocalStorageUserRepository } from './core/infrastructure/repositories/local-storage-user.repository';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideTranslateService({
      lang: 'pt',
      fallbackLang: 'pt',
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        suffix: '.json',
      }),
    }),
    provideAppInitializer(() => {
      const translate = inject(TranslateService);
      return firstValueFrom(translate.use('pt'));
    }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    { provide: USER_REPOSITORY, useClass: LocalStorageUserRepository },
    {
      provide: ACCESSIBILITY_PREFERENCES_REPOSITORY,
      useClass: LocalStorageAccessibilityRepository,
    },
    { provide: ACTIVITY_SESSION_REPOSITORY, useClass: LocalStorageActivitySessionRepository },
    { provide: NOTE_REPOSITORY, useClass: LocalStorageNoteRepository },
  ],
};
