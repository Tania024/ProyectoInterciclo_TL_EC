
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(), provideFirebaseApp(() => initializeApp({"projectId":"parqueadero-d2859","appId":"1:294983985685:web:c1e6ead59871eee49c3c1c","storageBucket":"parqueadero-d2859.firebasestorage.app","apiKey":"AIzaSyB4HAx3rw9MyG_rbhM1eCRmtWvbXKyXNCo","authDomain":"parqueadero-d2859.firebaseapp.com","messagingSenderId":"294983985685"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
