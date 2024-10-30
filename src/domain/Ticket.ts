//Representa los contratos de arrendamiento de los espacios de parqueo.

import { EspacioParqueadero } from "./EspacioParqueadero";
import { Usuario } from "./Usuario";
import { Vehiculo } from "./Vehiculo";


export class Ticket {
    public id?: number;
    public usuario?: Usuario; // Referencia al usuario asociado al ticket
    public espacioParqueadero?: EspacioParqueadero; // Espacio de parqueo reservado
    public vehiculo?: Vehiculo; // Vehículo asociado al ticket
    public horaEntrada?: Date;
    public horaSalida?: Date;
    public tiempoParqueo: number = 0;
    public estadoSalida: boolean = false;

    // constructor() {
    //     this.usuario = new Usuario();
    //     this.espacioParqueadero = new EspacioParqueadero();
    //     this.vehiculo = new Vehiculo();
    // }
}
