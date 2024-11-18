import { Injectable } from '@angular/core';
import { Horario } from '../../domain/Horario';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HorarioService {

  private collectionName = 'Horario';

  constructor(private firestore: AngularFirestore) {}

  // Obtener todos los horarios
  getHorarios(): Observable<Horario[]> {
    return this.firestore
      .collection<Horario>(this.collectionName, ref => ref.orderBy('diaSemana'))
      .valueChanges({ idField: 'id' }); 
  }
  
  addHorario(horario: Horario): Promise<void> {
    const docRef = this.firestore.collection(this.collectionName).doc();
    const id = docRef.ref.id; 
    horario.id = id;
    return docRef.set(horario);
  }
  

  // Actualizar un horario existente
  updateHorario(id: string, horario: Horario): Promise<void> {
    return this.firestore
      .collection(this.collectionName)
      .doc(id)
      .update(horario);
  }

  // Eliminar un horario
  deleteHorario(id: string): Promise<void> {
    return this.firestore
      .collection(this.collectionName)
      .doc(id)
      .delete();
  }
}