import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from './environments/environment';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFireAuthModule,
      AngularFirestoreModule,
    ),
    ...appConfig.providers, provideFirebaseApp(() => initializeApp({"projectId":"parqueadero-d2859","appId":"1:294983985685:web:c1e6ead59871eee49c3c1c","storageBucket":"parqueadero-d2859.firebasestorage.app","apiKey":"AIzaSyB4HAx3rw9MyG_rbhM1eCRmtWvbXKyXNCo","authDomain":"parqueadero-d2859.firebaseapp.com","messagingSenderId":"294983985685"})), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({"projectId":"parqueadero-d2859","appId":"1:294983985685:web:c1e6ead59871eee49c3c1c","storageBucket":"parqueadero-d2859.firebasestorage.app","apiKey":"AIzaSyB4HAx3rw9MyG_rbhM1eCRmtWvbXKyXNCo","authDomain":"parqueadero-d2859.firebaseapp.com","messagingSenderId":"294983985685"})), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({"projectId":"parqueadero-d2859","appId":"1:294983985685:web:c1e6ead59871eee49c3c1c","storageBucket":"parqueadero-d2859.firebasestorage.app","apiKey":"AIzaSyB4HAx3rw9MyG_rbhM1eCRmtWvbXKyXNCo","authDomain":"parqueadero-d2859.firebaseapp.com","messagingSenderId":"294983985685"})), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({"projectId":"parqueadero-d2859","appId":"1:294983985685:web:c1e6ead59871eee49c3c1c","storageBucket":"parqueadero-d2859.firebasestorage.app","apiKey":"AIzaSyB4HAx3rw9MyG_rbhM1eCRmtWvbXKyXNCo","authDomain":"parqueadero-d2859.firebaseapp.com","messagingSenderId":"294983985685"})), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({"projectId":"parqueadero-d2859","appId":"1:294983985685:web:c1e6ead59871eee49c3c1c","storageBucket":"parqueadero-d2859.firebasestorage.app","apiKey":"AIzaSyB4HAx3rw9MyG_rbhM1eCRmtWvbXKyXNCo","authDomain":"parqueadero-d2859.firebaseapp.com","messagingSenderId":"294983985685"})), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({"projectId":"parqueadero-d2859","appId":"1:294983985685:web:c1e6ead59871eee49c3c1c","storageBucket":"parqueadero-d2859.firebasestorage.app","apiKey":"AIzaSyB4HAx3rw9MyG_rbhM1eCRmtWvbXKyXNCo","authDomain":"parqueadero-d2859.firebaseapp.com","messagingSenderId":"294983985685"})), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({"projectId":"parqueadero-d2859","appId":"1:294983985685:web:c1e6ead59871eee49c3c1c","storageBucket":"parqueadero-d2859.firebasestorage.app","apiKey":"AIzaSyB4HAx3rw9MyG_rbhM1eCRmtWvbXKyXNCo","authDomain":"parqueadero-d2859.firebaseapp.com","messagingSenderId":"294983985685"})), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({"projectId":"parqueadero-d2859","appId":"1:294983985685:web:c1e6ead59871eee49c3c1c","storageBucket":"parqueadero-d2859.firebasestorage.app","apiKey":"AIzaSyB4HAx3rw9MyG_rbhM1eCRmtWvbXKyXNCo","authDomain":"parqueadero-d2859.firebaseapp.com","messagingSenderId":"294983985685"})), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({"projectId":"parqueadero-d2859","appId":"1:294983985685:web:c1e6ead59871eee49c3c1c","storageBucket":"parqueadero-d2859.firebasestorage.app","apiKey":"AIzaSyB4HAx3rw9MyG_rbhM1eCRmtWvbXKyXNCo","authDomain":"parqueadero-d2859.firebaseapp.com","messagingSenderId":"294983985685"})), provideFirestore(() => getFirestore())
  ]
}).catch((err) => console.error(err));

