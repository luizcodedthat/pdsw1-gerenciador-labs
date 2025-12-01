import { defineStore } from "pinia";
import ReservationService from "@/services/ReservationService";

export const useReservationStore = defineStore("reservations", {
  state: () => ({
    reservations: [],   // cache local
    loading: false
  }),

  getters: {
    reservationsByLab: (state) => {
      return (labId) => state.reservations.filter(r => r.labId === labId);
    },

    getById: (state) => {
      return (id) => state.reservations.find(r => r.id === id) || null;
    }
  },

  actions: {
    async loadReservations() {
      this.loading = true;
      this.reservations = await ReservationService.getAllReservations();
      this.loading = false;
    },

    async loadReservationsByLab(labId) {
      this.loading = true;
      const data = await ReservationService.getReservationsByLab(labId);

      data.forEach(res => {
        if (!this.reservations.some(r => r.id === res.id)) {
          this.reservations.push(res);
        }
      });

      this.loading = false;
    },

    async addReservation(reservationData) {
      const created = await ReservationService.createReservation(reservationData);
      this.reservations.push(created);
      return created;
    },

    async updateReservation(id, updates) {
      const updated = await ReservationService.updateReservation(id, updates);

      const index = this.reservations.findIndex(r => r.id === id);
      if (index !== -1) {
        this.reservations[index] = updated;
      }

      return updated;
    },

    async deleteReservation(id) {
      await ReservationService.deleteReservation(id);
      this.reservations = this.reservations.filter(r => r.id !== id);
    }
  }
});
