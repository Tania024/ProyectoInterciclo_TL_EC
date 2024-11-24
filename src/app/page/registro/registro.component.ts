import { Component } from '@angular/core';
import { Usuario } from '../../../domain/Usuario';
//import { AutenticacionService } from '../../services/autenticacion.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuarios.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {
  usuario: Usuario = new Usuario();
  mensajeErrorEmail: string = ''; 

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  registrar(): void {
    if (!this.validarCorreo(this.usuario.email)) {
      this.mensajeErrorEmail = 'El correo electrónico debe contener un @.';
      return;
    }
    this.mensajeErrorEmail = ''; 

    this.usuario.rol = 'cliente'; // Solo se registran usuarios como clientes
    this.usuarioService.registrarUsuario(this.usuario)
      .then(() => {
        alert('Usuario registrado exitosamente');
        this.router.navigate(['/iniciarSesion']);
      })
      .catch(error => {
        console.error('Error al registrar usuario:', error);
        alert('Error al registrar usuario');
      });
  }

  validarCorreo(email: string): boolean {
    return email.includes('@'); // Valida que el correo contenga un '@'
  }

  redirigirALogin() {
    this.router.navigate(['/iniciarSesion']);
  }
}

