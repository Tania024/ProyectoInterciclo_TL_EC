import { Injectable } from '@angular/core';
import { Tarifa } from '../../domain/Tarifa';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TarifasService {
  private tarifasCollection = 'tarifas';

  constructor(private firestore: AngularFirestore) {}

  // Obtener lista de tarifas
  obtenerTarifas(): Observable<Tarifa[]> {
    return this.firestore.collection<Tarifa>(this.tarifasCollection).valueChanges({ idField: 'id' });
  }

  // Crear una nueva tarifa
  crearTarifa(tarifa: Tarifa): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection(this.tarifasCollection).doc(id).set({ ...tarifa, id });
  }

  // Actualizar una tarifa existente
  actualizarTarifa(tarifa: Tarifa): Promise<void> {
    return this.firestore.collection(this.tarifasCollection).doc(tarifa.id?.toString()).update(tarifa);
  }

  // Eliminar una tarifa
  eliminarTarifa(id: string): Promise<void> {
    return this.firestore.collection(this.tarifasCollection).doc(id).delete();
  }
}