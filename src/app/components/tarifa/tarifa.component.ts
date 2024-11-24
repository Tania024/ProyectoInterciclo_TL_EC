import { Component } from '@angular/core';
import { TarifasService } from '../../services/tarifas.service';
import { Tarifa } from '../../../domain/Tarifa';
import { FormsModule, FormSubmittedEvent } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tarifa',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tarifa.component.html',
  styleUrl: './tarifa.component.scss'
})
export class TarifaComponent {
  tarifas: Tarifa[] = [];
  nuevaTarifa: Tarifa = new Tarifa();
  editandoTarifa: Tarifa | null = null;
  esAdministrador: boolean = false; 

  constructor(private tarifaService: TarifasService) {}

  ngOnInit(): void {
    this.verificarRolUsuario();
    if (this.esAdministrador) {
      this.cargarTarifas();
    }
  }

  verificarRolUsuario(): void {
    const rol = localStorage.getItem('rol');
    this.esAdministrador = rol === 'administrador';
  }

 cargarTarifas(): void {
    this.tarifaService.obtenerTarifas().subscribe((tarifas) => {
      this.tarifas = tarifas;
    });
  }
  
  agregarTarifa(): void {
    if (this.nuevaTarifa.nombreTarifa && this.nuevaTarifa.precio) { // Verifica campos requeridos
      this.tarifaService.crearTarifa(this.nuevaTarifa).then(() => {
        alert("Tarifa agregada correctamente"); // Mensaje de éxito
        this.nuevaTarifa = new Tarifa(); // Limpia el formulario
        this.cargarTarifas(); // Recarga la lista de tarifas
      }).catch((error) => {
        console.error("Error al agregar la tarifa:", error);
      });
    } else {
      alert("Por favor, completa todos los campos obligatorios antes de agregar la tarifa.");
    }
  }
  

  seleccionarTarifa(tarifa: Tarifa): void {
    this.editandoTarifa = { ...tarifa };
  }

    actualizarTarifa(): void {
      if (this.editandoTarifa) {
        this.tarifaService.actualizarTarifa(this.editandoTarifa).then(() => {
          alert("Tarifa editada correctamente"); 
          this.editandoTarifa = null; 
          this.cargarTarifas(); 
        }).catch((error) => {
          console.error("Error al actualizar la tarifa:", error);
          alert("Ocurrió un error al editar la tarifa. Intenta de nuevo.");
        });
      }
    }

  eliminarTarifa(id: string): void {
    this.tarifaService.eliminarTarifa(id).then(() => {
      alert("Tarifa eliminada correctamente"); // Mensaje de éxito
      this.cargarTarifas(); // Recarga la lista de tarifas actualizada
    }).catch((error) => {
      console.error("Error al eliminar la tarifa:", error);
    });
  }
  
}
