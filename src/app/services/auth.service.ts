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

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;
      if (user) {
        await this.checkOrCreateUser(user);
        this.router.navigate(['/inicio']);
      }
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
    }
  }

  // Verifica si el usuario existe en Firestore, si no, lo crea con rol de "cliente"
  private async checkOrCreateUser(user: User) {
    const userDocRef = doc(this.db, 'usuarios', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Crear nuevo usuario con rol de "cliente"
      const newUser: Usuario = {
        id: user.uid,
        username: user.displayName || '',
        email: user.email || '',
        contrasena: '',
        rol: 'cliente',
        perfilCompleto: false,
        tickets: [],
        vehiculos: []
      };
      await setDoc(userDocRef, newUser);
      console.log('Usuario creado como cliente:', newUser);
    }
  }
}