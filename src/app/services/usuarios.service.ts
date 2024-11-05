import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Usuario } from '../../domain/Usuario';
import { AngularFireAuth } from '@angular/fire/compat/auth';



@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private collectionName = 'usuarios';

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

  iniciarSesion(username: string, contrasena: string): Promise<Usuario | undefined> {
    return new Promise((resolve, reject) => {
      this.firestore.collection<Usuario>(this.collectionName, ref => ref.where('username', '==', username).where('contrasena', '==', contrasena)).get().subscribe(
        (querySnapshot) => {
          if (querySnapshot.empty) {
            reject('Usuario o contraseña incorrectos');
          } else {
            const usuario = querySnapshot.docs[0].data();
            resolve(usuario);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }





}