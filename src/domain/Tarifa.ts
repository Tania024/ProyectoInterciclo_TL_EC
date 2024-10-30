//Representa las tarifas aplicables en el parqueadero.

export class Tarifa {
    public id?: number;
    public nombreTarifa?: string;
    public precioHora: number = 0;
    public descripcion?: string;

}
