import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuarios.service';
import { Usuario } from '../../../domain/Usuario';
import { AuthService } from '../../services/auth.service';


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

//mio
  errorMessage: string = '';
  usuario: Usuario = new Usuario();
    
  constructor(private usuarioService: UsuarioService, private router: Router,private authService: AuthService) {}

  signInWithGoogle() {
    this.authService.signInWithGoogle().then(() => {
      this.router.navigate(['/inicio']);
    }).catch(error => {
      console.error('Error al iniciar sesión con Google:', error);
    });
  }

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


