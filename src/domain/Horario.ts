// Representa el horario de operación del parqueadero.

import { EspacioParqueadero } from "./EspacioParqueadero";

export class Horario {
    public id?: number;
    public diaSemana?: string;
    public horaApertura?: string;
    public horaCierre?: string;
    public espacioParqueadero?: EspacioParqueadero; // Relación opcional con EspacioParqueadero

    // constructor() {
    //     this.espacioParqueadero = new EspacioParqueadero();
    // }

}