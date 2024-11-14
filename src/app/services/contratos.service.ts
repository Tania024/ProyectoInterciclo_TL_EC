import { Injectable } from '@angular/core';
import { Contrato } from '../../domain/Contrato';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Usuario } from '../../domain/Usuario';
@Injectable({
  providedIn: 'root'
})
export class ContratosService {
  private collectionName = 'contrato';

  constructor(private firestore: AngularFirestore) {}

  // Obtener lista de contratos
  obtenerContratos(): Observable<Contrato[]> {
    return this.firestore.collection<Contrato>(this.collectionName).valueChanges({ idField: 'id' });
  }

  // Crear un nuevo contrato
  crearContrato(contrato: Contrato): Promise<void> {
    const id = this.firestore.createId();
    contrato.id = id;
    const contratoData = JSON.parse(JSON.stringify(contrato)); // Evita errores de propiedades undefined
    return this.firestore.collection(this.collectionName).doc(id).set(contratoData);
  }

  // Actualizar un contrato existente
  actualizarContrato(id: string, contrato: Partial<Contrato>): Promise<void> {
    const contratoData = JSON.parse(JSON.stringify(contrato)); // Evita valores undefined
    return this.firestore.collection(this.collectionName).doc(id).update(contratoData);
  }

  // Eliminar un contrato
  eliminarContrato(id: string): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(id).delete();
  }
  
}