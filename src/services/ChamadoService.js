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

  async getAllChamados() {
    const docs = await this.dao.getAll();
    return docs.map((d) => this.normalize(d));
  }

  async getChamadoById(id) {
    const doc = await this.dao.get(id);
    return this.normalize(doc);
  }

  async createChamado(data) {
    const chamado = new Chamado({
      ...data,
      createdAt: Date.now(),
      comentario: ""
    });

    if (!chamado.isValid()) {
      throw new Error("Dados do chamado são inválidos");
    }

    const id = await this.dao.insert(chamado.toJSON());

    return this.normalize({ id, ...chamado.toJSON() });
  }

  async updateChamado(id, updates = {}) {
    const raw = await this.dao.get(id);
    if (!raw) throw new Error("Chamado não encontrado");

    const updatedDoc = { ...raw, ...updates };

    updatedDoc.createdAt =
      typeof updatedDoc.createdAt === "number"
        ? updatedDoc.createdAt
        : Date.now();

    const dataToSave = {
      authorId: updatedDoc.authorId ?? null,
      labId: updatedDoc.labId ?? null,
      titulo: updatedDoc.titulo ?? "",
      descricao: updatedDoc.descricao ?? "",
      status: updatedDoc.status ?? "aberto",
      createdAt: updatedDoc.createdAt,
      comentario: updatedDoc.comentario ?? ""
    };

    await this.dao.update(id, dataToSave);

    return this.normalize({ id, ...dataToSave });
  }

  async deleteChamado(id) {
    await this.dao.delete(id);
    return true;
  }

  async searchChamados(property, value) {
    const docs = await this.dao.search(property, value);
    return docs.map((d) => this.normalize(d));
  }
}

export default new ChamadoService();
