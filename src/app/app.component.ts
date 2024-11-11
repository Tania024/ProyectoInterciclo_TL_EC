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
  isCliente: boolean = false;

  //Para el administrador TARIFA
  isAdmin: boolean = false;

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit(): void {
    this.usuarioService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });
    this.usuarioService.isCliente$.subscribe(isCliente => {
      this.isCliente = isCliente;
    });
    this.checkUserAuthentication();
  }

  /*checkUserAuthentication(): void {
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
      this.isCliente = role === 'cliente';
      this.isAdmin = role === 'administrador'; // Establece isAdmin si el rol es administrador
    }

// Redirigir a la página adecuada según el rol del usuario
goToGestion(): void {
  if (this.isCliente) {
    this.router.navigate(['/perfil']); // Redirige al perfil si el usuario es cliente
  } else if (this.isAdmin) {
    this.router.navigate(['/tarifa']); // Redirige a tarifa si el usuario es administrador
  }
}

cerrarSesion(): void {
  this.usuarioService.cerrarSesion().then(() => {
    this.isAuthenticated = false;
    this.isCliente = false;
    this.isAdmin = false;
    this.router.navigate(['/inicio']);
  }).catch(error => {
    console.error('Error al cerrar sesión:', error);
  });
}

}