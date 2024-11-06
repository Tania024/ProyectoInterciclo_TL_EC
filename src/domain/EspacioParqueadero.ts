//Representa los espacios de parqueo disponibles en el sistema.

import { Tarifa } from "./Tarifa";
import { Ticket } from "./Ticket";

export class EspacioParqueadero {
    public id?: string;
    public ubicacion?: string;
    public disponible?: boolean;
    public tarifaId?: string; // Almacena solo el ID de la tarifa
    public contratoId?: number;
    public tickets: Ticket[] = []; // Lista de tickets asociados a este espacio de parqueo

    // constructor() {
    //     this.tarifa = new Tarifa();
    // }

}
