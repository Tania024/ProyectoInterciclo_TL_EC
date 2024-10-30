import { Injectable } from '@angular/core';
import { Usuario } from '../../domain/Usuario';
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private usuarios: Usuario[] = [];

  obtenerUsuarios(rol: 'usuario' | 'administrador'): Usuario[] | null {
    if (rol === 'administrador') {
      return this.usuarios;
    } else {
      console.error("Acceso denegado: solo los administradores pueden ver la lista de usuarios.");
      return null;
    }
  }

  agregarUsuario(usuario: Usuario): void {
    this.usuarios.push(usuario);
  }

  actualizarPerfil(id: number, usuarioActualizado: Usuario, rol: 'usuario' | 'administrador'): void {
    const index = this.usuarios.findIndex(u => u.id === id);
    if (index !== -1) {
      if (rol === 'administrador' || this.usuarios[index].id === usuarioActualizado.id) {
        this.usuarios[index] = usuarioActualizado;
      } else {
        console.error("Acceso denegado: solo los administradores pueden actualizar perfiles de otros usuarios.");
      }
    }
  }

  eliminarUsuario(id: number, rol: 'administrador'): void {
    if (rol === 'administrador') {
      this.usuarios = this.usuarios.filter(u => u.id !== id);
    } else {
      console.error("Acceso denegado: solo los administradores pueden eliminar usuarios.");
    }
  }
}