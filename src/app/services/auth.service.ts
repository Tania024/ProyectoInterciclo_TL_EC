import { Injectable } from '@angular/core';
import { getAuth, signInWithPopup, GoogleAuthProvider, Auth, onAuthStateChanged, User, updateProfile } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

import { Usuario } from '../../domain/Usuario';

import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { authState } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: Auth;
  private db: Firestore;

  constructor(private router: Router) {
    
    const app = initializeApp(environment.firebaseConfig);

    this.auth = getAuth(app);
    this.db = getFirestore(app);
  }


  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider)
      .catch(error => {
        console.error('Error al iniciar sesión con Google:', error);
      });
  }
}