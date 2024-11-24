import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  usuarios: Usuario[] = [];
  espaciosParqueadero: EspacioParqueadero[] = [];
  esAdministrador: boolean = false;
  contratoForm!: FormGroup;
  editando: boolean = false;
  contratoSeleccionadoId?: string;

  constructor(
    private contratosService: ContratosService,
    private usuarioService: UsuarioService,
    private espaciosService: EspaciosParqueaderoService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.verificarRol();
    this.cargarUsuarios();
    this.cargarEspaciosParqueadero();
    this.cargarContratos();
    this.inicializarFormulario();
  }


  verificarRol(): void {
    this.esAdministrador = this.usuarioService.esAdministrador();
  }

  // Cargar todos los usuarios y luego los contratos
  cargarUsuarios(): void {
    this.usuarioService.obtenerUsuarios().subscribe(
      (usuarios) => {
        console.log('Usuarios recibidos desde el backend:', usuarios); // Ver estructura completa
        this.usuarios = usuarios.filter(usuario => usuario.rol === 'cliente'); // Filtrar clientes
        console.log('Usuarios cargados (solo clientes):', this.usuarios); // Confirmar filtrado
        
        // Reiniciar el campo del formulario (si había un valor previo seleccionado)
        this.contratoForm.get('usuarioId')?.setValue(null);
  
        // Forzar la detección de cambios para actualizar la vista
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error al cargar los usuarios:', error);
      }
    );
  }

  cargarEspaciosParqueadero(): void {
    this.espaciosService.obtenerEspaciosConTarifas().subscribe(
      (espacios) => {
        console.log('Espacios cargados desde el backend:', espacios); // Verificar datos originales
        // Filtrar espacios por intervalo "mes"
        this.espaciosParqueadero = espacios.filter(
          (espacio) => espacio.tarifa?.intervalo === 'mes'
        );
        console.log('Espacios disponibles por mes:', this.espaciosParqueadero); // Confirmar filtrado
      },
      (error) => {
        console.error('Error al cargar espacios de parqueadero:', error);
      }
    );
  }

  cargarContratos(): void {
    if (this.esAdministrador) {
      // Asegurarnos de cargar usuarios y espacios antes de los contratos
      this.usuarioService.obtenerUsuarios().pipe(
        switchMap((usuarios) => {
          this.usuarios = usuarios;
          return this.espaciosService.obtenerEspaciosConTarifas();
        }),
        switchMap((espacios) => {
          this.espaciosParqueadero = espacios;
          return this.contratosService.obtenerContratos();
        })
      ).subscribe(
        (contratos) => {
          this.contratos = contratos.map((contrato) => {
            // Buscar el usuario y el espacio relacionados con el contrato
            const usuario = this.usuarios.find((u) => u.id === contrato.usuarioId) || { nombre: 'Usuario no encontrado' };
            const espacio = this.espaciosParqueadero.find((e) => e.id === contrato.espacioParqueaderoId) || { ubicacion: 'Espacio no encontrado' };
  
            // Mapear los datos al contrato
            return {
              ...contrato,
              usuario,
              espacioParqueadero: espacio,
            } as Contrato;
          });
  
          console.log('Contratos cargados (Administrador):', this.contratos);
        },
        (error) => {
          console.error('Error al cargar contratos:', error);
        }
      );
    } else {
      // Cliente: cargar solo los contratos asociados al usuario logueado
      const usuarioId = localStorage.getItem('userId');
      if (usuarioId) {
        this.espaciosService.obtenerEspaciosConTarifas().pipe(
          switchMap((espacios) => {
            this.espaciosParqueadero = espacios;
            return this.contratosService.obtenerContratosPorUsuario(usuarioId);
          })
        ).subscribe(
          (contratos) => {
            this.contratos = contratos.map((contrato) => {
              const espacio = this.espaciosParqueadero.find((e) => e.id === contrato.espacioParqueaderoId) || { ubicacion: 'Espacio no encontrado' };
  
              return {
                ...contrato,
                espacioParqueadero: espacio,
              } as Contrato;
            });
  
            console.log('Contratos cargados (Cliente):', this.contratos);
          },
          (error) => {
            console.error('Error al cargar contratos (Cliente):', error);
          }
        );
      } else {
        console.warn('No se encontró usuario logueado.');
        this.contratos = [];
      }
    }
  }  

  inicializarFormulario(): void {
    this.contratoForm = this.fb.group(
      {
        usuarioId: [null, Validators.required], // Inicializa con null explícito
        espacioParqueaderoId: [null, Validators.required], // Inicializa con null explícito
        fechaInicio: ['', Validators.required],
        fechaFin: ['', Validators.required],
      },
      { validators: this.validarDuracionContrato }
    );
  }

  crearContrato(): void {
    if (this.contratoForm.valid) {
      const espacio = this.espaciosParqueadero.find((e) => e.id === this.contratoForm.value.espacioParqueaderoId);
  
      if (!espacio) { // Validación de espacio
        alert('Espacio no válido. Seleccione un espacio existente.');
        return;
      }
  
      const contrato: Contrato = {
        ...this.contratoForm.value,
        fechaInicio: new Date(this.contratoForm.value.fechaInicio),
        fechaFin: new Date(this.contratoForm.value.fechaFin),
      };
  
      this.contratosService.crearContrato(contrato).then(() => {
        this.espaciosService.actualizarEspacio({ id: espacio.id, disponible: false }) // Actualización de disponibilidad
          .then(() => {
            alert('Contrato creado y espacio actualizado.');
            this.cargarContratos();
            this.contratoForm.reset();
          });
      });
    }
  }

  editarContrato(contrato: Contrato): void {
    this.editando = true;
    this.contratoSeleccionadoId = contrato.id;
    this.contratoForm.patchValue({
      usuarioId: contrato.usuarioId,
      espacioParqueaderoId: contrato.espacioParqueaderoId,
      fechaInicio: contrato.fechaInicio?.toISOString().split('T')[0],
      fechaFin: contrato.fechaFin?.toISOString().split('T')[0],
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
          this.cargarContratos();
          this.contratoForm.reset();
          this.editando = false;
        });
    } else {
      alert('Complete todos los campos del formulario.');
    }
  }

  eliminarContrato(id: string): void {
    const contrato = this.contratos.find((c) => c.id === id);
  
    this.contratosService.eliminarContrato(id).then(() => {
      if (contrato?.espacioParqueaderoId) {
        this.espaciosService.actualizarEspacio({ id: contrato.espacioParqueaderoId, disponible: true }) // Actualización de disponibilidad
          .then(() => {
            alert('Contrato eliminado y espacio marcado como disponible.');
            this.cargarContratos();
          });
      }
    });
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.contratoForm.reset();
  }

  validarDuracionContrato(control: AbstractControl): ValidationErrors | null {
    const fechaInicio = control.get('fechaInicio')?.value;
    const fechaFin = control.get('fechaFin')?.value;

    if (!fechaInicio || !fechaFin) {
      return null;
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diferenciaDias = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24);

    return diferenciaDias !== 30 ? { duracionInvalida: true } : null;
  }
}
