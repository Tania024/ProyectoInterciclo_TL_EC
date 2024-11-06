import { Component } from '@angular/core';
import { EspacioParqueadero } from '../../../domain/EspacioParqueadero';
import { EspaciosParqueaderoService } from '../../services/espacios-parqueadero.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuarios.service';
import { Tarifa } from '../../../domain/Tarifa';
import { TarifasService } from '../../services/tarifas.service';

@Component({
  selector: 'app-parqueadero',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './parqueadero.component.html',
  styleUrl: './parqueadero.component.scss'
})
export class ParqueaderoComponent {
  espacios: EspacioParqueadero[] = [];
  nuevoEspacio: EspacioParqueadero = new EspacioParqueadero();
  esAdministrador: boolean = false;
  tarifas: Tarifa[] = [];

  constructor(
    private espacioService: EspaciosParqueaderoService,
    private usuarioService: UsuarioService,
    private tarifaService: TarifasService
  ) {}

  ngOnInit(): void {
    this.esAdministrador = this.usuarioService.esAdministrador();
    this.cargarEspacios();
    this.cargarTarifas();
  }

  cargarEspacios(): void {
    this.espacioService.obtenerEspacios().subscribe((espacios) => {
      this.espacios = espacios;
    });
  }

  cargarTarifas(): void {
    this.tarifaService.obtenerTarifas().subscribe((tarifas) => {
      this.tarifas = tarifas;
    });
  }

  agregarEspacio(): void {
    // Convertir el objeto en un objeto plano JSON
    const espacioPlano = JSON.parse(JSON.stringify(this.nuevoEspacio));
  
    this.espacioService.crearEspacio(espacioPlano).then(() => {
      this.nuevoEspacio = new EspacioParqueadero(); // Resetear el formulario
      this.cargarEspacios(); // Recargar la lista de espacios
    }).catch(error => {
      console.error('Error al agregar espacio:', error);
    });
  }
  

  seleccionarEspacio(espacio: EspacioParqueadero): void {
    this.nuevoEspacio = { ...espacio };
  }

  actualizarEspacio(): void {
    if (this.nuevoEspacio.id) {
      this.espacioService.actualizarEspacio(this.nuevoEspacio).then(() => {
        this.nuevoEspacio = new EspacioParqueadero();
      });
    }
  }

  eliminarEspacio(id: string): void {
    this.espacioService.eliminarEspacio(id);
  }

  obtenerNombreTarifa(tarifaId: string | undefined): string {
    const tarifa = this.tarifas.find(t => t.id === tarifaId);
    return tarifa ? `${tarifa.nombreTarifa} - ${tarifa.precio} USD / ${tarifa.intervalo}` : 'Tarifa no asignada';
  }

  // Método para cambiar el estado de disponibilidad al presionar "Adquirir"
  adquirirEspacio(espacio: EspacioParqueadero): void {
    espacio.disponible = false;  // Cambia el estado a "No disponible"
    
    // Opcional: Actualizar el estado en Firebase para reflejar el cambio
    this.espacioService.actualizarEspacio(espacio).then(() => {
      console.log("Espacio adquirido con éxito.");
      alert("Has separado tu espacio en el parqueadero.");
    }).catch(error => {
      console.error("Error al actualizar el espacio:", error);
    });
  }
  


}
