import { Routes } from '@angular/router';
import { IniciarSesionComponent } from './page/iniciar-sesion/iniciar-sesion.component';
import { RegistroComponent } from './page/registro/registro.component';
import { InicioComponent } from './page/inicio/inicio.component';

export const routes: Routes = [
    { path: '', component: InicioComponent },
    { path: 'login', component: IniciarSesionComponent },
    { path: 'registro', component: RegistroComponent },
//   { path: 'usuario', component: UsuarioComponent },
//   { path: 'espacios-parqueadero', component: EspaciosParqueaderoComponent },
//   { path: 'tarifas', component: TarifasComponent },
//   { path: 'tickets', component: TicketsComponent },
//   { path: 'facturas', component: FacturasComponent },
//   { path: 'vehiculos', component: VehiculosComponent },
//   { path: 'contratos', component: ContratosComponent },
//   { path: 'horarios', component: HorariosComponent },
];
