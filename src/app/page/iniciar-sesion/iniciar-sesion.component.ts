import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
//import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from '../../../domain/Usuario';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-iniciar-sesion',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './iniciar-sesion.component.html',
  styleUrl: './iniciar-sesion.component.scss'
})
export class IniciarSesionComponent {
  /*constructor(private firestore: AngularFirestore, private router: Router) {}

  // Asegúrate de que el método `iniciarSesion` acepta dos parámetros: usuario y contrasena
  async iniciarSesion(usuario: string, contrasena: string) {
    try {
      const usuarioDoc = await this.firestore.collection('usuarios', ref => ref.where('usuario', '==', usuario)).get().toPromise();
      
      if (usuarioDoc && !usuarioDoc.empty) {
        const docData = usuarioDoc.docs[0].data();
        const userData = docData as Usuario; 

        if (userData.contrasena === contrasena) {
          const rol = userData.rol;
          this.router.navigate([rol === 'administrador' ? '/administrador' : '/usuario']);
        } else {
          alert("Contraseña incorrecta.");
        }
      } else {
        alert("Usuario no encontrado.");
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
    }
  }*/
  
}
