import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuarios.service';


@Component({
  selector: 'app-iniciar-sesion',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './iniciar-sesion.component.html',
  styleUrl: './iniciar-sesion.component.scss'
})
export class IniciarSesionComponent {

    username: string = '';
  contrasena: string = '';

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  iniciarSesion(): void {
    this.usuarioService.iniciarSesion(this.username, this.contrasena)
      .then((usuario) => {
        if (usuario) {
          alert('Inicio de sesión exitoso');
          this.router.navigate(['/inicio']);
        }
      })
      .catch(error => {
        console.error('Error al iniciar sesión:', error);
        alert('Usuario o contraseña incorrectos');
      });
  }
  
}