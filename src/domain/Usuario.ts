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
}
