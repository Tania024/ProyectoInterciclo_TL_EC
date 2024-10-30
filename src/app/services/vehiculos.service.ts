import { Injectable } from '@angular/core';
import { Vehiculo } from '../../domain/Vehiculo';
@Injectable({
  providedIn: 'root'
})
export class VehiculosService {

  private vehiculos: Vehiculo[] = [];

  obtenerVehiculos(): Vehiculo[] {
    return this.vehiculos;
  }

  agregarVehiculo(vehiculo: Vehiculo): void {
    this.vehiculos.push(vehiculo);
  }

  actualizarVehiculo(placa: string, vehiculoActualizado: Vehiculo): void {
    const index = this.vehiculos.findIndex(v => v.placa === placa);
    if (index !== -1) {
      this.vehiculos[index] = vehiculoActualizado;
    }
  }

  eliminarVehiculo(placa: string): void {
    this.vehiculos = this.vehiculos.filter(v => v.placa !== placa);
  }
}