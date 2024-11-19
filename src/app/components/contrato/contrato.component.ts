import { Component, OnInit } from '@angular/core';
import { Contrato } from '../../../domain/Contrato';
import { Usuario } from '../../../domain/Usuario';
import { EspacioParqueadero } from '../../../domain/EspacioParqueadero';
import { ContratosService } from '../../services/contratos.service';
import { UsuarioService } from '../../services/usuarios.service';
import { EspaciosParqueaderoService } from '../../services/espacios-parqueadero.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-contrato',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './contrato.component.html',
  styleUrl: './contrato.component.scss',
  providers: [DatePipe]
})
export class ContratoComponent  implements OnInit{
  contratos: Contrato[] = [];
  usuarios: Usuario[] = []; // Lista de usuarios
  espaciosParqueadero: EspacioParqueadero[] = [];
  esAdministrador: boolean = false;
  contratoForm!: FormGroup;
  editando: boolean = false; // Indica si estamos editando un contrato existente
  contratoSeleccionadoId?: string;

  constructor(
    private contratosService: ContratosService,
    private usuarioService: UsuarioService,
    private espaciosService: EspaciosParqueaderoService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.verificarRol();
    this.cargarUsuarios();
    this.cargarEspaciosParqueadero(); // Primero cargar espacios
    this.cargarContratos(); // Luego cargar contratos
    this.inicializarFormulario();
  }
  

  verificarRol(): void {
    this.esAdministrador = this.usuarioService.esAdministrador();
  }

  // Cargar todos los usuarios y luego los contratos
  cargarUsuarios(): void {
    this.usuarioService.obtenerUsuarios().subscribe(
      (usuarios) => {
        this.usuarios = usuarios;
        this.obtenerContratos(); // Llamamos a obtenerContratos después de cargar los usuarios
      },
      (error) => {
        console.error('Error al cargar los usuarios:', error);
      }
    );
  }

  cargarEspaciosParqueadero(): void {
    this.espaciosService.obtenerEspaciosConTarifas().subscribe((espacios) => {
      // Filtrar espacios disponibles con tarifas mensuales
      this.espaciosParqueadero = espacios.filter((espacio) => {
        return (
          espacio.disponible && // Solo espacios disponibles
          espacio.tarifa?.intervalo === 'mes' // Con tarifa mensual
        );
      });
      if (this.espaciosParqueadero.length === 0) {
        console.warn('No hay espacios disponibles con tarifa mensual.');
      }
    });
  }
  

  cargarContratos(): void {
  this.contratosService.obtenerContratos().subscribe((data) => {
    this.contratos = data.map((contrato) => {
      const usuario = this.usuarios.find((u) => u.id === contrato.usuarioId);
      const espacio = this.espaciosParqueadero.find((e) => e.id === contrato.espacioParqueaderoId);

      return {
        ...contrato,
        usuario: usuario || { nombre: 'Usuario no encontrado' },
        espacioParqueadero: espacio || { ubicacion: 'Espacio no encontrado' },
      } as Contrato;
    });

    console.log('Contratos cargados:', this.contratos);
  });
}

  obtenerContratos(): void {
    if (this.esAdministrador) {
      // Si es administrador, obtiene todos los contratos
      this.contratosService.obtenerContratos().subscribe(
        (data) => {
          // Vincular contratos con usuarios
          this.contratos = data.map((contrato) => {
            const usuario = this.usuarios.find(
              (user) => user.id === contrato.usuarioId
            );
            return {
              ...contrato,
              usuario: usuario || { nombre: 'Usuario no encontrado' } as Usuario,
            };
          });
        },
        (error) => {
          console.error('Error al obtener los contratos:', error);
        }
      );
    } else {
      const usuarioId = localStorage.getItem('userId'); // ID del usuario actual
      if (usuarioId) {
        this.contratosService.obtenerContratosPorUsuario(usuarioId).subscribe(
          (data) => {
            // Vincular contratos con usuarios
            this.contratos = data.map((contrato) => {
              const usuario = this.usuarios.find(
                (user) => user.id === contrato.usuarioId
              );
              return {
                ...contrato,
                usuario: usuario || { nombre: 'Usuario no encontrado' } as Usuario,
              };
            });
          },
          (error) => {
            console.error('Error al obtener los contratos del cliente:', error);
          }
        );
      }
    }
  }
  
  inicializarFormulario(): void {
    this.contratoForm = this.fb.group({
      usuarioId: ['', Validators.required], // Selección de usuario
      espacioParqueaderoId: ['', Validators.required], // Selección de espacio
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required]
    });
  }

  crearContrato(): void {
    if (this.contratoForm.valid) {
      const espacio = this.espaciosParqueadero.find((e) => e.id === this.contratoForm.value.espacioParqueaderoId);
  
      if (!espacio) {
        alert('Espacio no válido. Seleccione un espacio existente.');
        return;
      }
  
      const contrato: Contrato = {
        ...this.contratoForm.value,
        fechaInicio: new Date(this.contratoForm.value.fechaInicio),
        fechaFin: new Date(this.contratoForm.value.fechaFin),
      };
  
      this.contratosService
        .crearContrato(contrato)
        .then(() => {
          alert('Contrato creado con éxito.');
          this.contratoForm.reset();
          this.cargarContratos(); // Recargar contratos después de crear uno
        })
        .catch((error) => {
          console.error('Error al crear el contrato:', error);
        });
    } else {
      alert('Por favor, complete todos los campos del formulario.');
    }
  }
  
  
  
  

  editarContrato(contrato: Contrato): void {
    this.editando = true;
    this.contratoSeleccionadoId = contrato.id;

    // Carga los datos del contrato en el formulario
    this.contratoForm.patchValue({
      usuarioId: contrato.usuarioId,
      espacioParqueaderoId: contrato.espacioParqueaderoId,
      fechaInicio: contrato.fechaInicio?.toISOString().split('T')[0],
      fechaFin: contrato.fechaFin?.toISOString().split('T')[0]
    });
  }

  actualizarContrato(): void {
    if (this.contratoForm.valid && this.contratoSeleccionadoId) {
      const contratoActualizado: Partial<Contrato> = {
        ...this.contratoForm.value,
        fechaInicio: new Date(this.contratoForm.value.fechaInicio),
        fechaFin: new Date(this.contratoForm.value.fechaFin),
      };

      this.contratosService
        .actualizarContrato(this.contratoSeleccionadoId, contratoActualizado)
        .then(() => {
          alert('Contrato actualizado con éxito.');
          this.contratoForm.reset();
          this.editando = false;
          this.cargarContratos();
        })
        .catch((error) => {
          console.error('Error al actualizar el contrato:', error);
        });
    } else {
      alert('Por favor, complete todos los campos del formulario.');
    }
  }

  eliminarContrato(id: string): void {
    if (confirm('¿Está seguro de que desea eliminar este contrato?')) {
      this.contratosService
        .eliminarContrato(id)
        .then(() => {
          alert('Contrato eliminado con éxito.');
          this.cargarContratos();
        })
        .catch((error) => {
          console.error('Error al eliminar el contrato:', error);
        });
    }
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.contratoForm.reset();
  }

}
