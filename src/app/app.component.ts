import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { InicioComponent } from './page/inicio/inicio.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink,InicioComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'parqueadero';
}
