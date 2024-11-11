import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Usuario } from '../../domain/Usuario';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private collectionName = 'usuarios';
//PARA AUTENTIFICACION PARA EDITARPERFIL
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private isClienteSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  isCliente$ = this.isClienteSubject.asObservable();

  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) {}

  registrarUsuario(usuario: Usuario): Promise<void> {
    const id = this.firestore.createId();
    usuario.id = id;
    // Eliminar propiedades undefined para evitar errores de Firebase
    const usuarioData = JSON.parse(JSON.stringify(usuario));
    return this.firestore.collection(this.collectionName).doc(id).set(usuarioData);
  }

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.firestore.collection<Usuario>(this.collectionName).valueChanges();
  }

  obtenerUsuarioPorId(id: string): Observable<Usuario | undefined> {
    return this.firestore.collection<Usuario>(this.collectionName).doc(id).valueChanges();
  }

  
    /*iniciarSesion(username: string, contrasena: string): Promise<Usuario | undefined> {
      return new Promise((resolve, reject) => {
        this.firestore.collection<Usuario>(this.collectionName, ref => ref.where('username', '==', username).where('contrasena', '==', contrasena)).get().subscribe(
          (querySnapshot) => {
            if (querySnapshot.empty) {
              reject('Usuario o contraseña incorrectos');
            } else {
              const usuario = querySnapshot.docs[0].data();
              
              if (usuario.rol) {
                // Usa coalescencia nula para asegurarte de que siempre se pase un string a localStorage
                localStorage.setItem('userId', usuario.id ?? ''); // Si usuario.id es undefined, se asigna una cadena vacía
                localStorage.setItem('rol', usuario.rol);
    
                // Actualizar el estado global de autenticación
                this.isAuthenticatedSubject.next(true);
                this.isClienteSubject.next(usuario.rol === 'cliente');
              }
              resolve(usuario);
            }
          },
          (error) => {
            reject(error);
          }
        );
      });
    }*/

      iniciarSesion(username: string, contrasena: string): Promise<Usuario | undefined> {
        return new Promise((resolve, reject) => {
          this.firestore.collection<Usuario>(this.collectionName, ref => ref.where('username', '==', username).where('contrasena', '==', contrasena)).get().subscribe(
            (querySnapshot) => {
              if (querySnapshot.empty) {
                reject('Usuario o contraseña incorrectos');
              } else {
                const usuario = querySnapshot.docs[0].data();
                
                if (usuario.rol) {
                  localStorage.setItem('userId', usuario.id ?? '');
                  localStorage.setItem('rol', usuario.rol);
      
                  // Actualizar el estado global de autenticación
                  this.isAuthenticatedSubject.next(true);
                  this.isClienteSubject.next(usuario.rol === 'cliente');
                }
                resolve(usuario);
              }
            },
            (error) => {
              reject(error);
            }
          );
        });
      }
      
    
// Obtener perfil de usuario por ID
obtenerPerfil(id: string): Observable<Usuario | undefined> {
  return this.firestore.collection<Usuario>(this.collectionName).doc(id).valueChanges();
}

// Actualizar perfil de usuario
actualizarPerfil(usuario: Usuario): Promise<void> {
  if (!usuario.id) throw new Error("Usuario ID es requerido para actualizar el perfil");
  return this.firestore.collection(this.collectionName).doc(usuario.id).update(JSON.parse(JSON.stringify(usuario)));
}

 
cerrarSesion(): Promise<void> {
  localStorage.removeItem('rol');
  localStorage.removeItem('userId');
  this.isAuthenticatedSubject.next(false);
  this.isClienteSubject.next(false);
  return this.afAuth.signOut();
}

  // Método para verificar si el usuario es administrador
  esAdministrador(): boolean {
    const rol = localStorage.getItem('rol');
    return rol === 'administrador';
  }



}