import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { InicioComponent } from './page/inicio/inicio.component';

import { CommonModule } from '@angular/common';
import { UsuarioService } from './services/usuarios.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'parqueadero';
  isAuthenticated: boolean = false;
  isClientecliente: boolean = false;
  //Para el administrador TARIFA
  isAdministrador: boolean = false;

  constructor(private usuarioService: UsuarioService, private router: Router) {}


  ngOnInit(): void {
    // Suscribirse a los estados de autenticación y rol
    this.usuarioService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });
    this.usuarioService.isCliente$.subscribe(isClientecliente => {
      this.isClientecliente = isClientecliente;
    });
    this.usuarioService.isAdmin$.subscribe(isAdministrador => {
      this.isAdministrador = isAdministrador;
    });

    // Verificar el estado inicial de autenticación y rol
    this.checkUserAuthentication();
  }

  /*ngOnInit(): void {
    this.usuarioService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });
    this.usuarioService.isCliente$.subscribe(isCliente => {
      this.isCliente = isCliente;
    });
    this.checkUserAuthentication();
  }

  checkUserAuthentication(): void {
    this.isAuthenticated = !!localStorage.getItem('userId');
    this.isCliente = localStorage.getItem('rol') === 'cliente';
  }

    goToPerfil(): void {
    this.router.navigate(['/perfil']);
  }
      cerrarSesion(): void {
    this.usuarioService.cerrarSesion().then(() => {
      this.isAuthenticated = false;
      this.isCliente = false;
      this.router.navigate(['/inicio']);
    }).catch(error => {
      console.error('Error al cerrar sesión:', error);
    });
  }
  */
    checkUserAuthentication(): void {
      const role = localStorage.getItem('rol');
      this.isAuthenticated = !!localStorage.getItem('userId');
      this.isClientecliente = role === 'cliente';
      this.isAdministrador = role === 'administrador'; 
    }

// Redirigir a la página adecuada según el rol del usuario
goToGestion(): void {
  if (this.isClientecliente) {
    this.router.navigate(['/perfil']); // Redirige al perfil si el usuario es cliente
  } else if (this.isAdministrador) {
    this.router.navigate(['/tarifa']); // Redirige a tarifa si el usuario es administrador
  }
}

cerrarSesion(): void {
  this.usuarioService.cerrarSesion().then(() => {
    this.isAuthenticated = false;
    this.isClientecliente = false;
    this.isAdministrador = false;
    this.router.navigate(['/inicio']);
  }).catch(error => {
    console.error('Error al cerrar sesión:', error);
  });
}

}