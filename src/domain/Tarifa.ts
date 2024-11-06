//Representa las tarifas aplicables en el parqueadero.

export class Tarifa {
    public id?: string;
    public nombreTarifa?: string;
    public precio: number = 0;
    public descripcion?: string;
    public intervalo: 'hora' | 'dia' | 'mes' = 'hora';

}
