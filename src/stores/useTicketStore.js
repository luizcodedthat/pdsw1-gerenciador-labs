import { defineStore } from "pinia";
import ChamadoService from "@/services/ChamadoService";

export const useTicketStore = defineStore("tickets", {
    state: () => ({
        tickets: [],                // Todos os tickets
        ticketById: {},             // Cache por ID
        ticketsByLab: {},           // Cache por laboratório (labId → array de tickets)

        lastFetchedAll: null,       // Timestamp da última busca global
        lastFetchedById: {},        // Timestamp da última busca por ticket ID
        lastFetchedByLab: {},       // Timestamp da última busca por labId

        loading: false
    }),

    actions: {

        async loadAllTickets(forceRefresh = false) {
            const FIVE_MIN = 5 * 60 * 1000;
            const now = Date.now();

            if (
                !forceRefresh &&
                this.lastFetchedAll &&
                now - this.lastFetchedAll < FIVE_MIN &&
                this.tickets.length > 0
            ) {
                return;
            }

            this.loading = true;

            const tickets = await ChamadoService.getAllTickets();
            this.tickets = tickets;
            this.tickets.sort((a, b) => b.createdAt - a.createdAt)

            tickets.forEach(t => {
                this.ticketById[t.id] = t;
            });

            this.lastFetchedAll = now;
            this.loading = false;
        },

        async loadTicketById(ticketId, forceRefresh = false) {
            const FIVE_MIN = 5 * 60 * 1000;
            const now = Date.now();

            if (
                !forceRefresh &&
                this.ticketById[ticketId] &&
                this.lastFetchedById[ticketId] &&
                now - this.lastFetchedById[ticketId] < FIVE_MIN
            ) {
                return this.ticketById[ticketId];
            }

            this.loading = true;

            const ticket = await ChamadoService.getTicketById(ticketId);

            this.ticketById[ticketId] = ticket;
            this.lastFetchedById[ticketId] = now;

            this.loading = false;

            return ticket;
        },

        async loadTicketsByLabId(labId, forceRefresh = false) {
            const FIVE_MIN = 5 * 60 * 1000;
            const now = Date.now();

            if (
                !forceRefresh &&
                this.ticketsByLab[labId] &&
                this.lastFetchedByLab[labId] &&
                now - this.lastFetchedByLab[labId] < FIVE_MIN
            ) {
                return this.ticketsByLab[labId];
            }

            this.loading = true;

            const tickets = await ChamadoService.getTicketsByLabId(labId);

            this.ticketsByLab[labId] = tickets;
            this.lastFetchedByLab[labId] = now;

            tickets.forEach(t => {
                this.ticketById[t.id] = t;
            });

            this.loading = false;

            return tickets;
        },

        async addTicket(ticketData) {
            this.loading = true;

            const newTicket = await ChamadoService.addTicket(ticketData);

            this.tickets.push(newTicket);
            this.tickets.sort((a, b) => b.createdAt - a.createdAt)
            this.ticketById[newTicket.id] = newTicket;

            if (!this.ticketsByLab[newTicket.labId]) {
                this.ticketsByLab[newTicket.labId] = [];
            }
            this.ticketsByLab[newTicket.labId].push(newTicket);

            this.loading = false;

            return newTicket;
        },

        async updateTicket(ticketId, updates) {
            this.loading = true;

            // Atualiza no Firebase via service
            const updated = await ChamadoService.updateTicket(ticketId, updates);

            // Atualiza no array principal
            const index = this.tickets.findIndex(t => t.id === ticketId);
            if (index !== -1) {
                this.tickets[index] = updated;
            }

            // Atualiza no cache por ID
            this.ticketById[ticketId] = updated;

            // Atualiza no cache por laboratório
            const labId = updated.labId;
            if (labId && this.ticketsByLab[labId]) {
                const labIndex = this.ticketsByLab[labId].findIndex(t => t.id === ticketId);
                if (labIndex !== -1) {
                    this.ticketsByLab[labId][labIndex] = updated;
                }
            }

            // Reordena lista principal pela data de criação
            this.tickets.sort((a, b) => b.createdAt - a.createdAt);

            this.loading = false;

            return updated;
        },


        async deleteTicket(ticketId) {
            this.loading = true;

            await ChamadoService.deleteTicket(ticketId);

            this.tickets = this.tickets.filter(t => t.id !== ticketId);

            const labId = this.ticketById[ticketId]?.labId;
            delete this.ticketById[ticketId];
            this.tickets.sort((a, b) => b.createdAt - a.createdAt)

            if (labId && this.ticketsByLab[labId]) {
                this.ticketsByLab[labId] =
                    this.ticketsByLab[labId].filter(t => t.id !== ticketId);
            }

            this.loading = false;
        }
    }
});
