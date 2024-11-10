import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../domain/Usuario';
import { UsuarioService } from '../../services/usuarios.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  usuario: Usuario = new Usuario();
  userId: string | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private authService: AuthService
  ) {}


  ngOnInit(): void {
    this.afAuth.user.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        console.log("User ID:", this.userId); // Verificar que el ID esté asignado
        this.cargarPerfil(this.userId);
      } else {
        this.router.navigate(['/iniciarSesion']);
      }
    });
  }

  cargarPerfil(id: string): void {
    this.usuarioService.obtenerPerfil(id).subscribe(usuario => {
      if (usuario) {
        this.usuario = { ...usuario, id };
        console.log("Perfil cargado:", this.usuario); // Verificar que el ID esté en el perfil
      }
    });
  }
  

    actualizarPerfil(): void {
      if (this.usuario.id) {
        const actualizacionFirestore = this.usuarioService.actualizarPerfil(this.usuario);
        let actualizacionContrasena: Promise<void> | null = null;
  
        if (this.usuario.contrasena) {
          actualizacionContrasena = this.authService.actualizarContrasena(this.usuario.contrasena);
        }
  
        Promise.all([actualizacionFirestore, actualizacionContrasena])
          .then(() => alert('Perfil actualizado exitosamente'))
          .catch(error => console.error('Error al actualizar perfil:', error));
      } else {
        console.error("No se puede actualizar el perfil: ID de usuario no encontrado.");
      }
    }
  }   

