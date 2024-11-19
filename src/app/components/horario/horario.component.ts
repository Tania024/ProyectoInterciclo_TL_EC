import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Horario } from '../../../domain/Horario';
import { HorarioService } from '../../services/horarios.service';

@Component({
  selector: 'app-horario',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './horario.component.html',
  styleUrl: './horario.component.scss'
})
export class HorarioComponent {
  horarios: Horario[] = []; // Arreglo inicializado vacío
  nuevoHorario: Horario = { diaSemana: '', horaApertura: '', horaCierre: '' };
  editandoHorario: Horario | null = null; // Para manejar edición de horarios
  mostrarFormulario = false; // Controla la visibilidad del formulario

  constructor(private horarioService: HorarioService) {}
  
  ngOnInit(): void {
    this.obtenerHorarios();
  }

  guardarHorario(): void {
    // Validar que todos los campos estén llenos
    if (
      !this.nuevoHorario.diaSemana?.trim() || 
      !this.nuevoHorario.horaApertura?.trim() || 
      !this.nuevoHorario.horaCierre?.trim()
    ) {
      alert('Por favor, completa todos los campos antes de guardar.');
      return; // Detiene la ejecución si los campos están vacíos
    }
  
    if (this.editandoHorario) {
      // Actualizar horario existente
      this.horarioService
        .updateHorario(this.editandoHorario.id!, this.nuevoHorario)
        .then(() => {
          alert('Horario actualizado correctamente.');
          this.cancelarEdicion();
        })
        .catch((error) => {
          console.error('Error al actualizar el horario:', error);
          alert('Error al actualizar el horario.');
        });
    } else {
      // Agregar nuevo horario
      this.horarioService
        .addHorario(this.nuevoHorario)
        .then(() => {
          alert('Horario agregado correctamente.');
          // Limpiar campos y cerrar formulario
          this.nuevoHorario = { diaSemana: '', horaApertura: '', horaCierre: '' };
          this.mostrarFormulario = false;
        })
        .catch((error) => {
          console.error('Error al agregar el horario:', error);
          alert('Error al agregar el horario.');
        });
    }
  }
  
  
  obtenerHorarios(): void {
    this.horarioService.getHorarios().subscribe(
      (horarios) => {
        this.horarios = horarios || []; // Asegúrate de inicializar el array si es null o undefined
      },
      (error) => {
        console.error('Error al obtener los horarios:', error);
        alert('Hubo un problema al cargar los horarios. Por favor, intenta más tarde.');
      }
    );
  }
  

  // Seleccionar horario para editar
  editarHorario(horario: Horario): void {
    this.mostrarFormulario = true;
    this.editandoHorario = horario;
    this.nuevoHorario = { ...horario }; // Copia el horario seleccionado
  }

  // Eliminar horario
  eliminarHorario(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este horario?')) {
      this.horarioService
        .deleteHorario(id)
        .then(() => {
          alert('Horario eliminado correctamente.');
        })
        .catch((error) => {
          console.error('Error al eliminar el horario:', error);
          alert('Error al eliminar el horario.');
        });
    }
  }

  // Cancelar edición o creación de horario
  cancelarEdicion(): void {
    this.mostrarFormulario = false; // Oculta el formulario
    this.nuevoHorario = { diaSemana: '', horaApertura: '', horaCierre: '' }; // Resetea los campos
    this.editandoHorario = null; // Limpia el estado de edición
  }
}