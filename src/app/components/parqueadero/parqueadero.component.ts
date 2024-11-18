import { Component } from '@angular/core';
import { EspacioParqueadero } from '../../../domain/EspacioParqueadero';
import { EspaciosParqueaderoService } from '../../services/espacios-parqueadero.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuarios.service';
import { Tarifa } from '../../../domain/Tarifa';
import { TarifasService } from '../../services/tarifas.service';
import { Contrato } from '../../../domain/Contrato';
import { ContratosService } from '../../services/contratos.service';

//TABLA DEL HORARIO
import { Horario } from '../../../domain/Horario';
import { HorarioService } from '../../services/horarios.service';

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
  //TABLA HORARIO
  horariosTabla: Horario[] = [];

  constructor(
    private espacioService: EspaciosParqueaderoService,
    private usuarioService: UsuarioService,
    private tarifaService: TarifasService,
    private contratosService: ContratosService,
    private horarioService: HorarioService
  ) {}

  ngOnInit(): void {
    this.esAdministrador = this.usuarioService.esAdministrador();
    this.cargarEspacios();
    this.cargarTarifas();
    this.cargarHorariosTabla();
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
 
 cargarHorariosTabla(): void {
  this.horarioService.getHorarios().subscribe((horarios) => {
    this.horariosTabla = horarios;
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

  obtenerDetalleTarifa(tarifaId: string | undefined): { nombre: string, precio: string, descripcion: string, intervalo: string } {
    const tarifa = this.tarifas.find(t => t.id === tarifaId);
    if (tarifa) {
      return {
        nombre: tarifa.nombreTarifa || 'Sin nombre',
        precio: `${tarifa.precio.toFixed(2)} USD`,
        descripcion: tarifa.descripcion || 'Sin descripción',
        intervalo: tarifa.intervalo
      };
    }
    return {
      nombre: 'Tarifa no asignada',
      precio: '',
      descripcion: '',
      intervalo: ''
    };
  }

  seleccionarIntervalo(espacio: EspacioParqueadero): string {
    const tarifaId = espacio.tarifaId;
    if (tarifaId) {
      const intervalo = this.obtenerDetalleTarifa(tarifaId).intervalo;
      console.log('Intervalo seleccionado:', intervalo);
      return intervalo;
    }
    return 'Intervalo no asignado';
  }

  generarContrato(espacio: EspacioParqueadero): void {
    const contrato: Contrato = {
      usuarioId: localStorage.getItem('userId')!, // Asegúrate de obtener el userId del localStorage
      espacioParqueaderoId: espacio.id!,
      espacioParqueadero: espacio,
      fechaInicio: new Date(),
      fechaFin: new Date(new Date().setDate(new Date().getDate() + 30)), // 30 días después
    };
    
    console.log('Contrato a guardar:', contrato); // Depuración

    this.contratosService
      .guardarContrato(contrato)
      .then(() => {
        alert('Contrato generado con éxito.');
        espacio.disponible = false;
        this.espacioService.actualizarEspacio(espacio);
      })
      .catch((error) => {
        console.error('Error al guardar el contrato:', error);
      });
  }
  
  

}
