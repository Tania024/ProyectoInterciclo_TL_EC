import { Ticket } from "./Ticket";
import { Vehiculo } from "./Vehiculo";


export class Usuario {
    public id?: string;
    public username: string = '';
    public contrasena: string = '';
    public nombre?: string;
    public email?: string;
    public rol?: 'cliente' | 'administrador';
    public telefono?: string;
    public perfilCompleto?: boolean;
    public tickets: Ticket[] = []; // Lista de tickets asociados al usuario
    public vehiculos: Vehiculo[] = []; // Lista de vehículos asociados al usuario

      // Datos de perfil
      public fotoPerfil?: string; // Foto de perfil del usuario
      public biografia?: string;


      constructor(data: Partial<Usuario> = {}) {
        this.id = data.id || '';
        this.username = data.username || '';
        this.contrasena = data.contrasena || '';
        this.nombre = data.nombre || '';
        this.email = data.email || '';
        this.rol = data.rol || 'cliente';
        this.telefono = data.telefono || '';
        this.perfilCompleto = data.perfilCompleto || false;
        this.tickets = data.tickets || [];
        this.vehiculos = data.vehiculos || [];
        this.fotoPerfil = data.fotoPerfil || '';
        this.biografia = data.biografia || '';
    }

    /* // Función estática para asegurar valores predeterminados
     static transformarAUsuario(data: Partial<Usuario>): Usuario {
      return new Usuario(data);*/
  }
  