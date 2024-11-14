import { Component, OnInit } from '@angular/core';
import { Contrato } from '../../../domain/Contrato';
import { Usuario } from '../../../domain/Usuario';
import { EspacioParqueadero } from '../../../domain/EspacioParqueadero';
import { ContratosService } from '../../services/contratos.service';
import { UsuarioService } from '../../services/usuarios.service';
import { EspaciosParqueaderoService } from '../../services/espacios-parqueadero.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-contrato',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './contrato.component.html',
  styleUrl: './contrato.component.scss',
  providers: [DatePipe]
})
export class ContratoComponent  implements OnInit{
  contratoForm: FormGroup;
  contratos: Contrato[] = [];
  usuarios: Usuario[] = []; // Lista de usuarios
  espaciosParqueadero: EspacioParqueadero[] = []; // Lista de espacios de parqueo
  editMode: boolean = false;
  currentContratoId?: string;
  esAdministrador: boolean = false;

  constructor(
    private fb: FormBuilder,
    private contratoService: ContratosService,
    private usuarioService: UsuarioService,
    private espaciosParqueaderoService: EspaciosParqueaderoService
  ) {
    this.contratoForm = this.fb.group({
      usuario: [''],
      espacioParqueadero: [''],
      fechaInicio: [''],
      fechaFin: [''],
    });
  }

  ngOnInit(): void {
    this.esAdministrador = this.usuarioService.esAdministrador();
    console.log('¿Es Administrador?', this.esAdministrador);

    this.getContratos();
    this.getUsuarios();
    this.getEspaciosParqueadero();
  }

  getContratos(): void {
    this.contratoService.obtenerContratos().subscribe((contratos) => {
      contratos.forEach((contrato) => {
        if (contrato.usuarioId) {
          this.usuarioService.obtenerUsuarioPorId(contrato.usuarioId).subscribe((usuario) => {
            contrato.usuario = usuario;
          });
        }

        if (contrato.espacioParqueaderoId) {
          this.espaciosParqueaderoService.obtenerEspacioPorId(contrato.espacioParqueaderoId).subscribe((espacio) => {
            contrato.espacioParqueadero = espacio;
          });
        }
      });

      this.contratos = contratos;
    });
  }

  getUsuarios(): void {
    this.usuarioService.obtenerUsuarios().subscribe((data) => {
      this.usuarios = data;
    });
  }

  getEspaciosParqueadero(): void {
    this.espaciosParqueaderoService.obtenerEspacios().subscribe((data) => {
      this.espaciosParqueadero = data;
    });
  }

  rentarEspacio(espacioId: string): void {
    const confirmacion = window.confirm('¿Estás seguro de rentar este espacio?');
    if (!confirmacion) {
      console.log('Renta cancelada por el usuario.');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('No se encontró el ID del usuario logueado.');
      return;
    }

    const contrato: Contrato = {
      usuarioId: userId,
      espacioParqueaderoId: espacioId,
      fechaInicio: new Date(),
      fechaFin: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    };

    this.contratoService.crearContrato(contrato).then(() => {
      console.log('Espacio rentado exitosamente.');

      this.espaciosParqueaderoService.actualizarEspacio({
        id: espacioId,
        disponible: false,
      }).then(() => {
        console.log('Espacio marcado como ocupado.');
        this.getEspaciosParqueadero();
      }).catch((error) => {
        console.error('Error al actualizar el estado del espacio:', error);
      });

    }).catch((error) => {
      console.error('Error al rentar el espacio:', error);
    });
  }

  deleteContrato(id: string): void {
    this.contratoService.eliminarContrato(id).then(() => {
      console.log('Contrato eliminado');
    }).catch((error) => {
      console.error('Error al eliminar el contrato:', error);
    });
  }

}
