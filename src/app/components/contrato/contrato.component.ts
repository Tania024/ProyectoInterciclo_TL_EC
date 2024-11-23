import { Component, OnInit } from '@angular/core';
import { Contrato } from '../../../domain/Contrato';
import { Usuario } from '../../../domain/Usuario';
import { EspacioParqueadero } from '../../../domain/EspacioParqueadero';
import { ContratosService } from '../../services/contratos.service';
import { UsuarioService } from '../../services/usuarios.service';
import { EspaciosParqueaderoService } from '../../services/espacios-parqueadero.service';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
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
      this.espaciosParqueadero = espacios;
      console.log('Espacios cargados:', this.espaciosParqueadero);
    });
  }
  
  

  cargarContratos(): void {
    // Asegurarse de que los espacios y usuarios están cargados antes de los contratos
    this.espaciosService.obtenerEspaciosConTarifas().pipe(
      switchMap((espacios) => {
        this.espaciosParqueadero = espacios.filter((espacio) => espacio.tarifa?.intervalo === 'mes');
        return this.usuarioService.obtenerUsuarios();
      }),
      switchMap((usuarios) => {
        this.usuarios = usuarios;
        return this.contratosService.obtenerContratos();
      })
    ).subscribe((contratos) => {
      this.contratos = contratos.map((contrato) => {
        const usuario = this.usuarios.find((u) => u.id === contrato.usuarioId) || { nombre: 'Usuario no encontrado' };
        const espacio = this.espaciosParqueadero.find((e) => e.id === contrato.espacioParqueaderoId) || { ubicacion: 'Espacio no encontrado' };
        return { ...contrato, usuario, espacioParqueadero: espacio } as Contrato;
      });
  
      console.log('Contratos cargados:', this.contratos);
    }, (error) => {
      console.error('Error al cargar contratos:', error);
    });
  }

  obtenerContratos(): void {
    if (this.esAdministrador) {
      // Si es administrador, obtiene todos los contratos
      this.contratosService.obtenerContratos().subscribe(
        (data) => {
          this.contratos = data;
        },
        (error) => {
          console.error('Error al obtener los contratos:', error);
        }
      );
    } else {
      // Si es cliente, filtra por usuarioId
      const usuarioId = localStorage.getItem('userId'); // ID del usuario que inició sesión
      if (usuarioId) {
        this.contratosService.obtenerContratosPorUsuario(usuarioId).subscribe(
          (data) => {
            this.contratos = data; // Solo contratos del cliente logueado
          },
          (error) => {
            console.error('Error al obtener los contratos del cliente:', error);
          }
        );
      } else {
        this.contratos = []; // Si no hay usuario logueado, no muestra contratos
      }
    }
  }
  
  
  
  inicializarFormulario(): void {
    this.contratoForm = this.fb.group(
      {
        usuarioId: ['', Validators.required], // Selección de usuario
        espacioParqueaderoId: ['', Validators.required], // Selección de espacio
        fechaInicio: ['', Validators.required],
        fechaFin: ['', Validators.required],
      },
      { validators: this.validarDuracionContrato } // Aplica el validador personalizado
    );
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
        // Actualizar disponibilidad del espacio
        this.espaciosService
          .actualizarEspacio({ id: espacio.id, disponible: false })
          .then(() => {
            alert('Contrato creado y espacio actualizado.');
            this.contratoForm.reset();
            this.cargarContratos(); // Recargar la lista de contratos
          })
          .catch((error) => {
            console.error('Error al actualizar disponibilidad del espacio:', error);
          });
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
    const contrato = this.contratos.find((c) => c.id === id);
  
    this.contratosService
      .eliminarContrato(id)
      .then(() => {
        if (contrato?.espacioParqueaderoId) {
          // Actualizar disponibilidad del espacio
          this.espaciosService
            .actualizarEspacio({ id: contrato.espacioParqueaderoId, disponible: true })
            .then(() => {
              alert('Contrato eliminado y espacio marcado como disponible.');
              this.cargarContratos(); // Recargar contratos después de eliminar uno
            })
            .catch((error) => {
              console.error('Error al actualizar disponibilidad del espacio:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Error al eliminar el contrato:', error);
      });
  }
  
  
  cancelarEdicion(): void {
    this.editando = false;
    this.contratoForm.reset();
  }


  // Validador personalizado para verificar que las fechas tengan una diferencia de 30 días
  validarDuracionContrato(control: AbstractControl): ValidationErrors | null {
    const fechaInicio = control.get('fechaInicio')?.value;
    const fechaFin = control.get('fechaFin')?.value;
  
    if (!fechaInicio || !fechaFin) {
      return null; // Si faltan fechas, no validar todavía
    }
  
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diferenciaDias = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24);
  
    if (diferenciaDias !== 30) {
      return { duracionInvalida: true }; // Retorna error si no son 30 días exactos
    }
  
    return null; // Todo está correcto
  }

}
