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
  horarios: Horario[] = []; 
  nuevoHorario: Horario = { diaSemana: '', horaApertura: '', horaCierre: '' };
  editandoHorario: Horario | null = null; 
  mostrarFormulario = false; 

  private diasOrdenados = [
    'lunes',
    'martes',
    'miercoles',
    'jueves',
    'viernes',
    'sábado',
    'domingo',
  ];

  constructor(private horarioService: HorarioService) {}
  
  ngOnInit(): void {
    this.obtenerHorarios();
  }

  guardarHorario(): void {
    if (
      !this.nuevoHorario.diaSemana?.trim() || 
      !this.nuevoHorario.horaApertura?.trim() || 
      !this.nuevoHorario.horaCierre?.trim()
    ) {
      alert('Por favor, completa todos los campos antes de guardar.');
      return;
    }
       const diaValidado = this.validarDiaSemana(this.nuevoHorario.diaSemana);
       if (!diaValidado) {
         alert('Por favor, ingresa un día de la semana válido.');
         return;
       }
       this.nuevoHorario.diaSemana = diaValidado;

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
        this.horarios = this.ordenarHorarios(horarios || []);
      },
      (error) => {
        console.error('Error al obtener los horarios:', error);
        alert('Hubo un problema al cargar los horarios. Por favor, intenta más tarde.');
      }
    );
  }
  
   // para validar y normalizar el día de la semana
   private validarDiaSemana(dia: string): string | null {
    const diaNormalizado = dia.toLowerCase().trim();
    const indice = this.diasOrdenados.indexOf(diaNormalizado);
    if (indice === -1) {
      return null; 
    }
    return this.diasOrdenados[indice].charAt(0).toUpperCase() + this.diasOrdenados[indice].slice(1);
  }

  // para ordenar horarios por día de la semana y hora de apertura
  private ordenarHorarios(horarios: Horario[]): Horario[] {
    return horarios.sort((a, b) => {
      const diaA = this.diasOrdenados.indexOf((a.diaSemana || '').toLowerCase());
      const diaB = this.diasOrdenados.indexOf((b.diaSemana || '').toLowerCase());

      // Comparar días
      if (diaA !== diaB) {
        return diaA - diaB;
      }

      return (a.horaApertura || '').localeCompare(b.horaApertura || '');
    });
  }

  // Seleccionar horario para editar
  editarHorario(horario: Horario): void {
    this.mostrarFormulario = true;
    this.editandoHorario = horario;
    this.nuevoHorario = { ...horario };
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
    this.mostrarFormulario = false; 
    this.nuevoHorario = { diaSemana: '', horaApertura: '', horaCierre: '' }; 
    this.editandoHorario = null; 
  }
}