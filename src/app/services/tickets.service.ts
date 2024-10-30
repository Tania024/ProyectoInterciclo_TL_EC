import { Injectable } from '@angular/core';
import { Ticket } from '../../domain/Ticket';
@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private tickets: Ticket[] = [];

  obtenerTickets(): Ticket[] {
    return this.tickets;
  }

  agregarTicket(ticket: Ticket): void {
    this.tickets.push(ticket);
  }

  actualizarTicket(id: number, ticketActualizado: Ticket): void {
    const index = this.tickets.findIndex(t => t.id === id);
    if (index !== -1) {
      this.tickets[index] = ticketActualizado;
    }
  }

  eliminarTicket(id: number): void {
    this.tickets = this.tickets.filter(t => t.id !== id);
  }
}