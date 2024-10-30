import { Injectable } from '@angular/core';
import { Factura } from '../../domain/Factura';
@Injectable({
  providedIn: 'root'
})
export class FacturasService {
  private facturas: Factura[] = [];

  obtenerFacturas(): Factura[] {
    return this.facturas;
  }

  agregarFactura(factura: Factura): void {
    this.facturas.push(factura);
  }

  actualizarFactura(id: number, facturaActualizada: Factura): void {
    const index = this.facturas.findIndex(f => f.id === id);
    if (index !== -1) {
      this.facturas[index] = facturaActualizada;
    }
  }

  eliminarFactura(id: number): void {
    this.facturas = this.facturas.filter(f => f.id !== id);
  }
}