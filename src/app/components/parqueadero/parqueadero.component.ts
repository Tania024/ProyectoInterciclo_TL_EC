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
      alert('El espacio ha sido agregado exitosamente.');
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
        alert('El espacio ha sido actualizado exitosamente.'); 
      });
    }
  }

  eliminarEspacio(id: string): void {
    this.espacioService.eliminarEspacio(id);
    alert('El espacio ha sido eliminado exitosamente.');
  }

  obtenerNombreTarifa(tarifaId: string | undefined): string {
    const tarifa = this.tarifas.find(t => t.id === tarifaId);
    return tarifa ? `${tarifa.nombreTarifa} - ${tarifa.precio} USD / ${tarifa.intervalo}` : 'Tarifa no asignada';
  }

  // Método para cambiar el estado de disponibilidad al presionar "Adquirir"
  adquirirEspacio(espacio: EspacioParqueadero): void {
    const userId = localStorage.getItem('userId');
  if (!userId) {
    alert('Debes iniciar sesión para adquirir este espacio.'); // Mensaje si no está autenticado
    return; // Salir del método si el usuario no está logueado
  }

    espacio.disponible = false; // Cambiar el estado a no disponible
  
    this.espacioService
      .actualizarEspacio(espacio)
      .then(() => {
        alert('Espacio adquirido con éxito.');
      })
      .catch((error) => {
        console.error('Error al actualizar el espacio:', error);
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
    const userId = localStorage.getItem('userId');
  if (!userId) {
    alert('Debes iniciar sesión para generar contrato.'); // Mensaje si no está autenticado
    return; 
  }
    if (!espacio.tarifaId || this.obtenerDetalleTarifa(espacio.tarifaId).intervalo !== 'mes') {
      alert('Solo se pueden generar contratos para tarifas mensuales.');
      return;
    }
  
    const contrato: Contrato = {
      usuarioId: localStorage.getItem('userId')!, // Obtén el ID del usuario logueado
      espacioParqueaderoId: espacio.id!,
      espacioParqueadero: espacio,
      fechaInicio: new Date(),
      fechaFin: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Contrato válido por 1 mes
    };
  
    this.contratosService
      .guardarContrato(contrato)
      .then(() => {
        alert('Contrato generado con éxito.');
        espacio.disponible = false; // Marcar el espacio como no disponible
        this.espacioService.actualizarEspacio(espacio); // Actualizar en Firebase
      })
      .catch((error) => {
        console.error('Error al guardar el contrato:', error);
      });
  }
  
  
  

}
