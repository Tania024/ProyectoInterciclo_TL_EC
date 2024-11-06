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

  // Crear un nuevo espacio de parqueo
  crearEspacio(espacio: any): Promise<void> {
    const id = this.firestore.createId();
    espacio.id = id;
    return this.firestore.collection(this.collectionName).doc(id).set(espacio);
  }

  // Actualizar un espacio de parqueo existente
  actualizarEspacio(espacio: EspacioParqueadero): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(espacio.id).update(espacio);
  }

  // Eliminar un espacio de parqueo
  eliminarEspacio(id: string): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(id).delete();
  }
}
