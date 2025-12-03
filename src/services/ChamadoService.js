import DAOService from "./DAOService";
import { Chamado } from "@/models/ChamadoModel";

class ChamadoService {
  constructor() {
    this.dao = new DAOService("chamados");
  }

  normalize(doc) {
    const createdAt =
      typeof doc.createdAt === "number" ? doc.createdAt : Date.now();

    const dataStr = new Date(createdAt).toLocaleDateString("pt-BR");

    const statusRaw = String(doc.status ?? "aberto");
    const status = statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1);

    return {
      id: doc.id,
      authorId: doc.authorId ?? null,
      labId: doc.labId ?? null,
      titulo: doc.titulo ?? "",
      descricao: doc.descricao ?? "",
      status,
      createdAt,
      data: dataStr,
      comentario: doc.comentario ?? ""
    };
  }

  async getAllTickets() {
    const docs = await this.dao.getAll();
    return docs.map(doc => new Chamado(doc));
  }

  async getTicketsByLabId(labId) {
    if (!labId) return [];

    const docs = await this.dao.search("labId", labId);
    return docs.map(doc => new Chamado(doc));
  }

  async getTicketById(id) {
    const doc = await this.dao.get(id);
    return this.normalize(doc);
  }

  async addTicket(data) {
    const chamado = new Chamado({
      ...data,
      createdAt: Date.now()
    });

    if (!chamado.isValid()) {
      throw new Error("Dados do ticket são inválidos");
    }

    const id = await this.dao.insert(chamado.toJSON());

    return this.normalize({ id, ...chamado.toJSON() });
  }

  async updateTicket(id, updates) {
    const existing = await this.getTicketById(id);
    const updated = new Chamado({ ...existing, ...updates });

    if (!updated.isValid()) {
      throw new Error("Dados atualizados são inválidos");
    }

    await this.dao.update(id, updated.toJSON());
    return updated;
  }

  async deleteTicket(id) {
    await this.dao.delete(id);
    return true;
  }

  async searchTickets(searchTerm) {
    if (!searchTerm || !searchTerm.trim()) {
      return this.getAllTickets();
    }

    const all = await this.getAllTickets();
    const term = searchTerm.toLowerCase();

    return all.filter(ch => ch.matchesSearch(term));
  }

  async getOpenTickets() {
    const all = await this.getAllTickets();
    return all.filter(ch => ch.status === "aberto");
  }
}

export default new ChamadoService();
