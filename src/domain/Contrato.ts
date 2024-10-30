// Representa los contratos de arrendamiento de los espacios de parqueo.

import { EspacioParqueadero } from "./EspacioParqueadero";
import { Usuario } from "./Usuario";

export class Contrato {
    public id?: number;
    public usuario?: Usuario; // Referencia directa al usuario con el contrato
    public espacioParqueadero?: EspacioParqueadero; // Referencia directa al espacio de parqueo arrendado
    public fechaInicio?: Date;
    public fechaFin?: Date;

    // constructor() {
    //     this.usuario = new Usuario();
    //     this.espacioParqueadero = new EspacioParqueadero();
    // }

}