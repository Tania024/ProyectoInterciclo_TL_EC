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
  contratos: Contrato[] = [];
  usuarios: Usuario[] = []; // Lista de usuarios
  esAdministrador: boolean = false;

  constructor(
    private contratosService: ContratosService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.verificarRol();
    this.cargarUsuarios(); // Cargamos todos los usuarios al iniciar
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
  
  

  
  
  eliminarContrato(id: string): void {
    if (confirm('¿Está seguro de que desea eliminar este contrato?')) {
      this.contratosService
        .eliminarContrato(id)
        .then(() => {
          alert('Contrato eliminado con éxito.');
          this.contratos = this.contratos.filter((contrato) => contrato.id !== id);
        })
        .catch((error) => {
          console.error('Error al eliminar el contrato:', error);
        });
    }
  }

}
