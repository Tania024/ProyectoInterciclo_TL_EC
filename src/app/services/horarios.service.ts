import { Injectable } from '@angular/core';
import { Horario } from '../../domain/Horario';

@Injectable({
  providedIn: 'root'
})
export class HorariosService {

  private horarios: Horario[] = [];

  obtenerHorarios(rol: 'usuario' | 'administrador'): Horario[] | null {
    if (rol === 'administrador') {
      return this.horarios;
    } else {
      console.error("Acceso denegado: solo los administradores pueden ver los horarios.");
      return null;
    }
  }

  agregarHorario(horario: Horario, rol: 'administrador'): void {
    if (rol === 'administrador') {
      this.horarios.push(horario);
    } else {
      console.error("Acceso denegado: solo los administradores pueden agregar horarios.");
    }
  }

  actualizarHorario(id: number, horarioActualizado: Horario, rol: 'administrador'): void {
    if (rol === 'administrador') {
      const index = this.horarios.findIndex(h => h.id === id);
      if (index !== -1) {
        this.horarios[index] = horarioActualizado;
      }
    } else {
      console.error("Acceso denegado: solo los administradores pueden actualizar horarios.");
    }
  }

  eliminarHorario(id: number, rol: 'administrador'): void {
    if (rol === 'administrador') {
      this.horarios = this.horarios.filter(h => h.id !== id);
    } else {
      console.error("Acceso denegado: solo los administradores pueden eliminar horarios.");
    }
  }
}