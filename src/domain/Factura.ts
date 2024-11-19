import { Tarifa } from "./Tarifa"



export class Factura {
    public id?: number
    public numero: string = ""
    public fecha:any
    public total?:number
    public tarifa:Tarifa = new Tarifa
    
}