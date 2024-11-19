import { Injectable } from '@angular/core';
import { Contrato } from '../../domain/Contrato';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable, switchMap } from 'rxjs';
import { Usuario } from '../../domain/Usuario';
@Injectable({
  providedIn: 'root'
})
export class ContratosService {
  private collectionName = 'contrato';

  constructor(private firestore: AngularFirestore) {}

  // Obtener lista de contratos
  obtenerContratos(): Observable<Contrato[]> {
    return this.firestore
      .collection<Contrato>(this.collectionName)
      .valueChanges()
      .pipe(
        map((contratos) =>
          contratos.map((contrato) => ({
            ...contrato,
            fechaInicio: this.convertirFecha(contrato.fechaInicio),
            fechaFin: this.convertirFecha(contrato.fechaFin),
          }))
        )
      );
  }

  private convertirFecha(fecha: any): Date | undefined {
    if (!fecha) return undefined; // Si la fecha es nula o indefinida
    if (fecha instanceof Date) return fecha; // Ya es un objeto Date
    if (fecha.toDate) return fecha.toDate(); // Es un Timestamp, conviértelo
    return new Date(fecha); // Último recurso: intenta convertirlo a Date
  }
  

  // Crear un nuevo contrato
  crearContrato(contrato: Contrato): Promise<void> {
    const id = this.firestore.createId();
    contrato.id = id;
    return this.firestore.collection(this.collectionName).doc(id).set(contrato);
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

  // Guardar un contrato
  guardarContrato(contrato: Contrato): Promise<void> {
    const id = this.firestore.createId(); // Genera un ID único
    contrato.id = id;
    return this.firestore.collection(this.collectionName).doc(id).set(contrato);
  }

  // Obtener contratos por usuario
  obtenerContratosPorUsuario(usuarioId: string): Observable<Contrato[]> {
    return this.firestore
      .collection<Contrato>(this.collectionName, (ref) =>
        ref.where('usuarioId', '==', usuarioId)
      )
      .valueChanges()
      .pipe(
        map((contratos) =>
          contratos.map((contrato) => ({
            ...contrato,
            fechaInicio: contrato.fechaInicio
              ? (contrato.fechaInicio as any).toDate()
              : undefined,
            fechaFin: contrato.fechaFin
              ? (contrato.fechaFin as any).toDate()
              : undefined,
          }))
        )
      );
  }

  
}