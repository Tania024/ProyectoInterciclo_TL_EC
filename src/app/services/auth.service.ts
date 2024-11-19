
/*import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Usuario } from '../../domain/Usuario';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, doc, getDoc, setDoc, getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';*/

import { Injectable } from '@angular/core';
import { getAuth, signInWithPopup, GoogleAuthProvider, Auth, onAuthStateChanged, User, updateProfile } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

import { Usuario } from '../../domain/Usuario';
import { UsuarioService } from './usuarios.service';
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
  
  constructor(private router: Router, private usuarioService: UsuarioService) {
    
    const app = initializeApp(environment.firebaseConfig);

    this.auth = getAuth(app);
    this.db = getFirestore(app);
  }
 
  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider)
      .then(async (result) => {
        const user = result.user;
        if (user) {
          const userRef = doc(this.db, 'usuarios', user.uid);
          const userSnap = await getDoc(userRef);
  
          if (!userSnap.exists()) {
            // Crear un nuevo usuario si no existe
            const newUser: Usuario = {
              id: user.uid,
              username: user.displayName || '',
              email: user.email || '',
              contrasena: '', // Contraseña no se aplica para usuarios de Google
              rol: 'cliente', // Asignar rol predeterminado
            };
            await setDoc(userRef, newUser);
          }
  
          // Establecer el rol y userId en localStorage
          localStorage.setItem('userId', user.uid);
          localStorage.setItem('rol', 'cliente'); // Asume que todos los usuarios de Google son clientes
  
          // Actualizar estados en el servicio de usuario
          this.usuarioService.updateAuthenticationState(true, 'cliente');
  
          // Redirigir al inicio o página correspondiente
          this.router.navigate(['/inicio']);
        }
      })
      .catch((error) => {
        console.error('Error al iniciar sesión con Google:', error);
      });
  }
}  
  











  /*signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider)
      .then(async (result) => {
        const user = result.user;
        if (user) {
          // Verificar si el usuario ya existe en Firestore
          const userRef = doc(this.db, 'usuarios', user.uid);
          const userSnap = await getDoc(userRef);
  
          if (!userSnap.exists()) {
            // Crear un nuevo usuario si no existe
            const newUser: Usuario = {
              id: user.uid,
              username: user.displayName || '',
              email: user.email || '',
              contrasena: '', // La contraseña no se almacena para Google users
              rol: 'cliente', // Asigna un rol predeterminado
            };
            await setDoc(userRef, newUser);
          }
  
          console.log('Inicio de sesión exitoso con Google');
          this.router.navigate(['/inicio']); // Redirige al usuario
        }
      })
      .catch((error) => {
        console.error('Error al iniciar sesión con Google:', error);
      });
  }
  
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
  
}*/

  /*private async checkOrCreateUser(user: any) {
    const userDocRef = doc(this.db, 'usuarios', user.uid);
    try {
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
        console.log('Usuario creado correctamente:', newUser);
      } else {
        console.log('El usuario ya existe:', userDoc.data());
      }
    } catch (error) {
      console.error('Error al verificar o crear el usuario:', error);
    }
  }*/
  
  /*// Verifica si el usuario existe en Firestore, si no, lo crea con rol de "cliente"
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
  }*/

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
 