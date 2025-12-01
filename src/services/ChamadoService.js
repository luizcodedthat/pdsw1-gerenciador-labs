import DAOService from './DAOService';
import { Chamado } from '../models/ChamadoModel';

class ChamadoService {
  constructor() {
    this.dao = new DAOService('chamados');
  }

  async getAllChamados() {
    const docs = await this.dao.getAll();
    return docs.map(doc => new Chamado(doc));
  }

  async getChamadosByLab(labId) {
    const all = await this.getAllChamados();
    return all.filter(c => c.labId === labId);
  }

  async getChamadoById(id) {
    const doc = await this.dao.get(id);
    return new Chamado(doc);
  }

  async createChamado(data) {
    const chamado = new Chamado(data);

    if (!chamado.isValid()) {
      throw new Error("Dados do chamado são inválidos");
    }

    const id = await this.dao.insert(chamado.toJSON());
    return { id, ...chamado };
  }

  async updateChamado(id, updates) {
    const existing = await this.getChamadoById(id);
    const updated = new Chamado({ ...existing, ...updates });

    if (!updated.isValid()) {
      throw new Error("Dados atualizados são inválidos");
    }

    await this.dao.update(id, updated.toJSON());
    return updated;
  }

  async deleteChamado(id) {
    await this.dao.delete(id);
    return true;
  }

  async searchChamados(searchTerm) {
    if (!searchTerm || !searchTerm.trim()) {
      return this.getAllChamados();
    }

    const all = await this.getAllChamados();
    const term = searchTerm.toLowerCase();

    return all.filter(ch => ch.matchesSearch(term));
  }

  async getOpenChamados() {
    const all = await this.getAllChamados();
    return all.filter(ch => ch.status === "aberto");
  }
}

export default new ChamadoService();
