import DAOService from './DAOService';
import { Reservation } from '../models/ReservationModel';

class ReservationService {
  constructor() {
    this.dao = new DAOService('reservations');
  }

  // Buscar todas as reservas
  async getAllReservations() {
    const docs = await this.dao.getAll();
    return docs.map(doc => new Reservation(doc));
  }

  // Buscar uma reserva pelo ID
  async getReservationById(id) {
    const doc = await this.dao.get(id);
    return new Reservation(doc);
  }

  // Criar nova reserva
  async createReservation(reservationData) {
    const reservation = new Reservation(reservationData);

    if (!reservation.isValid()) {
      throw new Error('Dados da reserva são inválidos');
    }

    // createdAt automático se não vier
    if (!reservation.createdAt) {
      reservation.createdAt = new Date().toISOString();
    }

    const id = await this.dao.insert(reservation.toJSON?.() ?? { ...reservation });

    return { id, ...reservation };
  }

  // Atualizar reserva
  async updateReservation(id, updates) {
    const existing = await this.getReservationById(id);
    const updated = new Reservation({ ...existing, ...updates });

    if (!updated.isValid()) {
      throw new Error('Dados atualizados são inválidos');
    }

    await this.dao.update(id, updated.toJSON?.() ?? { ...updated });
    return updated;
  }

  // Deletar reserva
  async deleteReservation(id) {
    await this.dao.delete(id);
    return true;
  }

  // Buscar reservas por termo
  async searchReservations(searchTerm) {
    if (!searchTerm || !searchTerm.trim()) {
      return this.getAllReservations();
    }

    const all = await this.getAllReservations();
    const term = searchTerm.toLowerCase();

    return all.filter(res => res.matchesSearch(term));
  }

  // Buscar reservas por laboratório específico (útil para página de lab)
  async getReservationsByLab(labId) {
    const all = await this.getAllReservations();
    return all.filter(reservation => reservation.labId === labId);
  }

  // Buscar reservas por data exata (útil se quiser calendário)
  async getReservationsByDate(dateStr) {
    const all = await this.getAllReservations();
    return all.filter(reservation => reservation.date === dateStr);
  }

  // Buscar reservas aprovadas
  async getApprovedReservations() {
    const all = await this.getAllReservations();
    return all.filter(res => res.approved === true);
  }
  
}

export default new ReservationService();
