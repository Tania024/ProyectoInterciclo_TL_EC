import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../domain/Usuario';
import { UsuarioService } from '../../services/usuarios.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-administracion-clientes',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './administracion-clientes.component.html',
  styleUrl: './administracion-clientes.component.scss'
})
export class AdministracionClientesComponent implements OnInit {
  clientes: Partial<Usuario>[] = []; // Permite objetos parciales de Usuario
  editCliente: Partial<Usuario> | null = null;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.obtenerClientes();
  }

  obtenerClientes(): void {
    this.usuarioService.obtenerClientes().subscribe(clientes => {
      this.clientes = clientes; // `clientes` ya es de tipo `Partial<Usuario>[]`
    });
  }

  editarCliente(cliente: Partial<Usuario>): void {
    this.editCliente = { ...cliente }; // Crear una copia para editar
  }

  guardarCambios(): void {
    if (this.editCliente) {
      const usuarioCompleto = new Usuario(this.editCliente); // Convertir a instancia completa
      this.usuarioService.actualizarPerfil(usuarioCompleto)
        .then(() => {
          // Actualizar la lista de clientes en la vista
          const index = this.clientes.findIndex(c => c.id === this.editCliente?.id);
          if (index !== -1) {
            this.clientes[index] = { ...usuarioCompleto };
          }
          alert('Cliente actualizado exitosamente');
          this.editCliente = null;
        })
        .catch(error => console.error('Error al actualizar el cliente:', error));
    }
  }

  cancelarEdicion(): void {
    this.editCliente = null;
  }

  eliminarCliente(id: string | undefined): void {
    if (!id) return;

    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      this.usuarioService.eliminarCliente(id)
        .then(() => {
          this.clientes = this.clientes.filter(cliente => cliente.id !== id);
          alert('Cliente eliminado exitosamente');
        })
        .catch(error => console.error('Error al eliminar el cliente:', error));
    }
  }
}