// labService.js
import DAOService from './DAOService';
import { Lab } from '../models/Lab';

class LabService {
  constructor() {
    this.dao = new DAOService('labs');
  }

  /**
   * Carrega todos os laboratórios e converte para instâncias de Lab
   */
  async getAllLabs() {
    const docs = await this.dao.getAll();
    return docs.map(doc => new Lab(doc));
  }

  /**
   * Busca um laboratório por ID
   */
  async getLabById(id) {
    const doc = await this.dao.get(id);
    return new Lab(doc);
  }

  /**
   * Cria um novo laboratório
   */
  async createLab(labData) {
    const lab = new Lab(labData);

    if (!lab.isValid()) {
      throw new Error('Dados do laboratório são inválidos');
    }

    const id = await this.dao.insert(lab.toJSON());
    return { id, ...lab };
  }

  /**
   * Atualiza um laboratório existente
   */
  async updateLab(id, updates) {
    const existing = await this.getLabById(id);
    const updated = new Lab({ ...existing, ...updates });

    if (!updated.isValid()) {
      throw new Error('Dados atualizados são inválidos');
    }

    await this.dao.update(id, updated.toJSON());
    return updated;
  }

  /**
   * Remove um laboratório
   */
  async deleteLab(id) {
    await this.dao.delete(id);
    return true;
  }

  /**
   * Procura laboratórios que correspondem ao searchTerm
   */
  async searchLabs(searchTerm) {
    if (!searchTerm || !searchTerm.trim()) {
      return this.getAllLabs();
    }

    const all = await this.getAllLabs();
    const term = searchTerm.toLowerCase();

    return all.filter(lab => lab.matchesSearch(term));
  }

  /**
   * Filtra laboratórios disponíveis
   */
  async getAvailableLabs() {
    const all = await this.getAllLabs();
    return all.filter(lab => lab.available === true);
  }
}

export default new LabService();
