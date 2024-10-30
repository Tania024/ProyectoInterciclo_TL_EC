import { Injectable } from '@angular/core';
 import { EspacioParqueadero } from '../../domain/EspacioParqueadero';
@Injectable({
  providedIn: 'root'
})
export class EspaciosParqueaderoService {

  private espacios: EspacioParqueadero[] = [];

  obtenerEspacios(rol: 'usuario' | 'administrador'): EspacioParqueadero[] | null {
    if (rol === 'administrador') {
      return this.espacios;
    } else {
      console.error("Acceso denegado: solo los administradores pueden ver los espacios de parqueo.");
      return null;
    }
  }

  agregarEspacio(espacio: EspacioParqueadero, rol: 'administrador'): void {
    if (rol === 'administrador') {
      this.espacios.push(espacio);
    } else {
      console.error("Acceso denegado: solo los administradores pueden agregar espacios de parqueo.");
    }
  }

  actualizarEspacio(id: number, espacioActualizado: EspacioParqueadero, rol: 'administrador'): void {
    if (rol === 'administrador') {
      const index = this.espacios.findIndex(e => e.id === id);
      if (index !== -1) {
        this.espacios[index] = espacioActualizado;
      }
    } else {
      console.error("Acceso denegado: solo los administradores pueden actualizar espacios de parqueo.");
    }
  }

  eliminarEspacio(id: number, rol: 'administrador'): void {
    if (rol === 'administrador') {
      this.espacios = this.espacios.filter(e => e.id !== id);
    } else {
      console.error("Acceso denegado: solo los administradores pueden eliminar espacios de parqueo.");
    }
  }
}
