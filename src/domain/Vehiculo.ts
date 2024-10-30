import { Usuario } from "./Usuario";

export class Vehiculo {
    public placa?: string; 
    public marca?: string; 
    public color?: string; 
    public cedula?: string; 
    public nombre?: string; 
    public descripcion?: string; // Descripción adicional del vehículo
    public propietario?: Usuario; // Relación con el usuario propietario del vehículo

    // constructor() {
    //     this.propietario = new Usuario();
    // }

}