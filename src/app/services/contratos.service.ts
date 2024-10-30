import { Injectable } from '@angular/core';
import { Contrato } from '../../domain/Contrato';
@Injectable({
  providedIn: 'root'
})
export class ContratosService {

  private contratos: Contrato[] = [];

  obtenerContratos(rol: 'usuario' | 'administrador'): Contrato[] | null {
    if (rol === 'administrador') {
      return this.contratos;
    } else {
      console.error("Acceso denegado: solo los administradores pueden ver los contratos.");
      return null;
    }
  }

  agregarContrato(contrato: Contrato, rol: 'administrador'): void {
    if (rol === 'administrador') {
      this.contratos.push(contrato);
    } else {
      console.error("Acceso denegado: solo los administradores pueden agregar contratos.");
    }
  }

  actualizarContrato(id: number, contratoActualizado: Contrato, rol: 'administrador'): void {
    if (rol === 'administrador') {
      const index = this.contratos.findIndex(c => c.id === id);
      if (index !== -1) {
        this.contratos[index] = contratoActualizado;
      }
    } else {
      console.error("Acceso denegado: solo los administradores pueden actualizar contratos.");
    }
  }

  eliminarContrato(id: number, rol: 'administrador'): void {
    if (rol === 'administrador') {
      this.contratos = this.contratos.filter(c => c.id !== id);
    } else {
      console.error("Acceso denegado: solo los administradores pueden eliminar contratos.");
    }
  }
}