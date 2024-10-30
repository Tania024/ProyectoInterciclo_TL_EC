import { Injectable } from '@angular/core';
import { Perfil } from '../../domain/Perfil';
@Injectable({
  providedIn: 'root'
})
export class PerfilsService {
  private perfiles: Perfil[] = [];

  obtenerPerfil(usuarioId: number): Perfil | null {
    return this.perfiles.find(p => p.usuario?.id === usuarioId) || null;
  }

  agregarPerfil(perfil: Perfil): void {
    this.perfiles.push(perfil);
  }

  actualizarPerfil(usuarioId: number, perfilActualizado: Perfil): void {
    const index = this.perfiles.findIndex(p => p.usuario?.id === usuarioId);
    if (index !== -1) {
      this.perfiles[index] = perfilActualizado;
    } else {
      console.error("Perfil no encontrado para el usuario especificado.");
    }
  }

  eliminarPerfil(usuarioId: number): void {
    this.perfiles = this.perfiles.filter(p => p.usuario?.id !== usuarioId);
  }
}