// Representa los contratos de arrendamiento de los espacios de parqueo.

import { EspacioParqueadero } from "./EspacioParqueadero";
import { Usuario } from "./Usuario";

export class Contrato {
    public id?: string;
  public usuarioId?: string; // Almacena solo el ID del usuario
  public usuario?: Usuario; 
  public espacioParqueaderoId?: string; // Almacena solo el ID del espacio
  public espacioParqueadero?: EspacioParqueadero; 
  public fechaInicio?: Date;
  public fechaFin?: Date;

}