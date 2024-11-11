
import { Routes } from '@angular/router';
import { InicioComponent } from './page/inicio/inicio.component';
import { IniciarSesionComponent } from './page/iniciar-sesion/iniciar-sesion.component';
import { RegistroComponent } from './page/registro/registro.component';
import { ParqueaderoComponent } from './components/parqueadero/parqueadero.component';
import { TarifaComponent } from './components/tarifa/tarifa.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
export const routes: Routes = [
    { path: '', redirectTo: '/inicio', pathMatch: 'full' },
    { path: 'inicio', component: InicioComponent },
    { path: 'iniciarSesion', component: IniciarSesionComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'parqueadero', component: ParqueaderoComponent },
    { path: 'tarifa', component: TarifaComponent },
    { path: 'nosotros', component: NosotrosComponent },
    { path: 'perfil', component: PerfilComponent }
   
  ];