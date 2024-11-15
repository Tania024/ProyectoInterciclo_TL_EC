//Representa los espacios de parqueo disponibles en el sistema.

import { Tarifa } from './Tarifa';

export class EspacioParqueadero {
  public id?: string;
  public ubicacion?: string;
  public disponible?: boolean;
  public tarifaId?: string; // ID de la tarifa asociada
  public tarifa?: Tarifa;  // Objeto completo de la tarifa
}

