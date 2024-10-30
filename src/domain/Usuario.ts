import { Ticket } from "./Ticket";
import { Vehiculo } from "./Vehiculo";

export class Usuario {
    public id?: number;
    public usuario?: string;
    public nombre?: string;
    public email?: string;
    public rol?: 'usuario' | 'administrador';
    public telefono?: string;
    public perfilCompleto?: boolean;
    public tickets: Ticket[] = []; // Lista de tickets asociados al usuario
    public vehiculos: Vehiculo[] = []; // Lista de vehículos asociados al usuario

    // constructor() {
    //     this.tickets = [];
    //     this.vehiculos = [];
    // }
}
