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
  esAdministrador: boolean = false; // Nuevo campo para verificar el rol

  constructor(private tarifaService: TarifasService) {}

  ngOnInit(): void {
    this.verificarRolUsuario();
    if (this.esAdministrador) {
      this.cargarTarifas();
    }
  }

  verificarRolUsuario(): void {
    // Verificar si el usuario es administrador; asumiendo que el rol está en localStorage
    const rol = localStorage.getItem('rol'); // Cambia esto según cómo manejes la autenticación
    this.esAdministrador = rol === 'administrador';
  }

  cargarTarifas(): void {
    this.tarifaService.obtenerTarifas().subscribe((tarifas) => {
      this.tarifas = tarifas;
    });
  }

  agregarTarifa(): void {
    this.tarifaService.crearTarifa(this.nuevaTarifa).then(() => {
      this.nuevaTarifa = new Tarifa(); // Resetear el formulario
    });
  }

  seleccionarTarifa(tarifa: Tarifa): void {
    this.editandoTarifa = { ...tarifa };
  }

  actualizarTarifa(): void {
    if (this.editandoTarifa) {
      this.tarifaService.actualizarTarifa(this.editandoTarifa).then(() => {
        this.editandoTarifa = null;
      });
    }
  }

  eliminarTarifa(id: string): void {
    this.tarifaService.eliminarTarifa(id);
  }

}
