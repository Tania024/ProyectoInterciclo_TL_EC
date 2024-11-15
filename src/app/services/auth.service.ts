
import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Usuario } from '../../domain/Usuario';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, doc, getDoc, setDoc, getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private db: Firestore;

  constructor(
    private afAuth: AngularFireAuth, // Usamos AngularFireAuth aquí
    private router: Router
  ) {
    const app = initializeApp(environment.firebaseConfig);
    this.db = getFirestore(app);
  }

  // Método para iniciar sesión con Google
  async signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await this.afAuth.signInWithPopup(provider);
      const user = result.user;
      if (user) {
        await this.checkOrCreateUser(user as any); // Cast `user` a `any` para evitar conflictos
        this.router.navigate(['/inicio']);
      }
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
    }
  }

  // Verifica si el usuario existe en Firestore, si no, lo crea con rol de "cliente"
  private async checkOrCreateUser(user: any) { // Usamos `any` para evitar conflictos de tipos
    const userDocRef = doc(this.db, 'usuarios', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      const newUser: Usuario = {
        id: user.uid,
        username: user.displayName || '',
        email: user.email || '',
        contrasena: '',
        rol: 'cliente',
        perfilCompleto: false,
        
        
      };
      await setDoc(userDocRef, newUser);
      console.log('Usuario creado como cliente:', newUser);
    }
  }

 /* // Método para actualizar la contraseña del usuario actual
  async actualizarContrasena(nuevaContrasena: string): Promise<void> {
    const user = await this.afAuth.currentUser; // Utiliza AngularFireAuth para obtener el usuario actual
    if (user) {
      await user.updatePassword(nuevaContrasena);
      console.log("Contraseña actualizada exitosamente");
    } else {
      throw new Error("No hay un usuario autenticado.");
    }
  }*/
    async obtenerUsuarioActual(): Promise<Usuario | null> {
      const user = await this.afAuth.currentUser;
      if (user) {
        const userDocRef = doc(this.db, 'usuarios', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          return userDoc.data() as Usuario;
        }
      }
      return null;
    }
    
}