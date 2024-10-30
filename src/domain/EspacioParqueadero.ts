//Representa los espacios de parqueo disponibles en el sistema.

import { Tarifa } from "./Tarifa";
import { Ticket } from "./Ticket";

export class EspacioParqueadero {
    public id?: number;
    public ubicacion?: string;
    public disponible?: boolean;
    public tarifa?: Tarifa; // Relación con la tarifa aplicada a este espacio
    public contratoId?: number;
    public tickets: Ticket[] = []; // Lista de tickets asociados a este espacio de parqueo

    // constructor() {
    //     this.tarifa = new Tarifa();
    // }

}
