
import { Routes } from '@angular/router';
import { InicioComponent } from './page/inicio/inicio.component';
import { IniciarSesionComponent } from './page/iniciar-sesion/iniciar-sesion.component';
import { RegistroComponent } from './page/registro/registro.component';

export const routes: Routes = [
    { path: '', redirectTo: '/inicio', pathMatch: 'full' },
    { path: 'inicio', component: InicioComponent },
    { path: 'iniciarSesion', component: IniciarSesionComponent },
    { path: 'registro', component: RegistroComponent },
   
  ];