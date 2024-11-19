import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { InicioComponent } from './page/inicio/inicio.component';

import { CommonModule } from '@angular/common';
import { UsuarioService } from './services/usuarios.service';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink,CommonModule,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'parqueadero';
  isAuthenticated: boolean = false;
  isClientecliente: boolean = false;
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

  checkUserAuthentication(): void {
    const role = localStorage.getItem('rol');
    this.isAuthenticated = !!localStorage.getItem('userId');
    this.isClientecliente = role === 'cliente';
    this.isAdministrador = role === 'administrador'; 
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