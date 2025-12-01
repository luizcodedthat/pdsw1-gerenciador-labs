import DAOService from './DAOService';
import { Lab } from '../models/Lab';

class LabService {
  constructor() {
    this.dao = new DAOService('labs');
  }

  async getAllLabs() {
    const docs = await this.dao.getAll();
    return docs.map(doc => new Lab(doc));
  }

  async getLabById(id) {
    const doc = await this.dao.get(id);
    return new Lab(doc);
  }

  async createLab(labData) {
    const lab = new Lab(labData);

    if (!lab.isValid()) {
      throw new Error('Dados do laboratório são inválidos');
    }

    const id = await this.dao.insert(lab.toJSON());
    return { id, ...lab };
  }

  async updateLab(id, updates) {
    const existing = await this.getLabById(id);
    const updated = new Lab({ ...existing, ...updates });

    if (!updated.isValid()) {
      throw new Error('Dados atualizados são inválidos');
    }

    await this.dao.update(id, updated.toJSON());
    return updated;
  }

  async deleteLab(id) {
    await this.dao.delete(id);
    return true;
  }

  async searchLabs(searchTerm) {
    if (!searchTerm || !searchTerm.trim()) {
      return this.getAllLabs();
    }

    const all = await this.getAllLabs();
    const term = searchTerm.toLowerCase();

    return all.filter(lab => lab.matchesSearch(term));
  }

  async getAvailableLabs() {
    const all = await this.getAllLabs();
    return all.filter(lab => lab.available === true);
  }
}

export default new LabService();
