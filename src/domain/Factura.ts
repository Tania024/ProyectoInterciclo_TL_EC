import { Tarifa } from "./Tarifa"
import { Ticket } from "./Ticket"


export class Factura {
    public id?: number
    public numero: string = ""
    public fecha:any
    public total?:number
    public ticket?:Ticket
    public tarifa:Tarifa = new Tarifa
    
}