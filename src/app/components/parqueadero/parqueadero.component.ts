import { Component } from '@angular/core';
import { EspacioParqueadero } from '../../../domain/EspacioParqueadero';
import { EspaciosParqueaderoService } from '../../services/espacios-parqueadero.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuarios.service';

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

  constructor(
    private espacioService: EspaciosParqueaderoService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.esAdministrador = this.usuarioService.esAdministrador();
    this.cargarEspacios();
  }

  cargarEspacios(): void {
    this.espacioService.obtenerEspacios().subscribe((espacios) => {
      this.espacios = espacios;
    });
  }

  agregarEspacio(): void {
    this.espacioService.crearEspacio(this.nuevoEspacio).then(() => {
      this.nuevoEspacio = new EspacioParqueadero(); // Resetear el formulario
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

}
