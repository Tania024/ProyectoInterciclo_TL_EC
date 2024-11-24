import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../../domain/Usuario';
import { UsuarioService } from '../../services/usuarios.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {

  usuario: Usuario = new Usuario();

  isLoading: boolean = false; 
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private usuarioService: UsuarioService,private router:Router) {}

    ngOnInit(): void {
      const userId = localStorage.getItem('userId');
      const rol = localStorage.getItem('rol');
      
      if (!userId || rol !== 'cliente') {
        this.router.navigate(['/iniciarSesion']); 
        return;
      }
    
      this.usuarioService.obtenerPerfil(userId).subscribe((usuario) => {
        if (usuario) {
          this.usuario = usuario;
        }
      });
    }
    
  
  actualizarPerfil(): void {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';
  
    this.usuarioService.actualizarPerfil(this.usuario)
      .then(() => {
        this.isLoading = false;
        this.successMessage = 'Perfil Actualizado Exitosamente';
      })
      .catch(error => {
        this.isLoading = false;
        this.errorMessage = 'Error al actualizar perfil';
        console.error('Error al actualizar perfil:', error);
      });
  }
 
 
}