import { Injectable } from '@angular/core';
 import { EspacioParqueadero } from '../../domain/EspacioParqueadero';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from '../../domain/Usuario';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EspaciosParqueaderoService {
  private collectionName = 'EspacioParqueadero';

  constructor(private firestore: AngularFirestore) {}

  // Obtener lista de espacios de parqueadero
  obtenerEspacios(): Observable<EspacioParqueadero[]> {
    return this.firestore.collection<EspacioParqueadero>(this.collectionName).valueChanges({ idField: 'id' });
  }

  obtenerEspacioPorId(id: string): Observable<EspacioParqueadero | undefined> {
    return this.firestore.collection<EspacioParqueadero>('EspacioParqueadero').doc(id).valueChanges();
  }  

  // Crear un nuevo espacio de parqueo
  crearEspacio(espacio: any): Promise<void> {
    const id = this.firestore.createId();
    espacio.id = id;
    return this.firestore.collection(this.collectionName).doc(id).set(espacio);
  }

  // Actualizar un espacio de parqueo existente
  actualizarEspacio(espacio: Partial<EspacioParqueadero>): Promise<void> {
    if (!espacio.id) {
      return Promise.reject(new Error('El ID del espacio es necesario para actualizarlo.'));
    }
  
    return this.firestore
      .collection(this.collectionName)
      .doc(espacio.id)
      .update(JSON.parse(JSON.stringify(espacio)));
  }
  

  // Eliminar un espacio de parqueo
  eliminarEspacio(id: string): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(id).delete();
  }
}
