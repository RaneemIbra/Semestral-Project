import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

const firebaseConfig = {
  apiKey: 'AIzaSyD4Ny8uk6PGAwxvsJCtw2d8MHfJzUfF7Ko',
  authDomain: 'semestral-project-app.firebaseapp.com',
  projectId: 'semestral-project-app',
  storageBucket: 'semestral-project-app.appspot.com',
  messagingSenderId: '1030728633842',
  appId: '1:1030728633842:web:99f04b854b74ef11bbef6b',
  measurementId: 'G-BHTB4GC56X',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ],
};
