import { Injectable } from '@angular/core';
import { Tarifa } from '../../domain/Tarifa';
@Injectable({
  providedIn: 'root'
})
export class TarifasService {
  private tarifas: Tarifa[] = [];

  obtenerTarifas(rol: 'usuario' | 'administrador'): Tarifa[] | null {
    if (rol === 'administrador') {
      return this.tarifas;
    } else {
      console.error("Acceso denegado: solo los administradores pueden ver las tarifas.");
      return null;
    }
  }

  agregarTarifa(tarifa: Tarifa, rol: 'administrador'): void {
    if (rol === 'administrador') {
      this.tarifas.push(tarifa);
    } else {
      console.error("Acceso denegado: solo los administradores pueden agregar tarifas.");
    }
  }

  actualizarTarifa(id: number, tarifaActualizada: Tarifa, rol: 'administrador'): void {
    if (rol === 'administrador') {
      const index = this.tarifas.findIndex(t => t.id === id);
      if (index !== -1) {
        this.tarifas[index] = tarifaActualizada;
      }
    } else {
      console.error("Acceso denegado: solo los administradores pueden actualizar tarifas.");
    }
  }

  eliminarTarifa(id: number, rol: 'administrador'): void {
    if (rol === 'administrador') {
      this.tarifas = this.tarifas.filter(t => t.id !== id);
    } else {
      console.error("Acceso denegado: solo los administradores pueden eliminar tarifas.");
    }
  }
}